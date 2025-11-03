import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Medication as MedicationIcon,
  Assignment as AssignmentIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import GetToken from 'utils/auth-token';
import { toast } from 'react-toastify';
import Backend from 'services/backend';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schemas
const carePlanSchema = yup.object().shape({
  care_plan_title: yup
    .string()
    .trim()
    .required('Care plan title is required')
    .min(3, 'Title must be at least 3 characters'),
  care_plan_description: yup
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters'),
  care_plan_status: yup
    .string()
    .oneOf(['active', 'completed', 'cancelled'], 'Invalid status')
    .required('Status is required'),
});

const goalSchema = yup.object().shape({
  goal_title: yup
    .string()
    .trim()
    .required('Goal title is required')
    .min(3, 'Goal title must be at least 3 characters'),
  goal_note: yup
    .string()
    .trim()
    .max(500, 'Note must be less than 500 characters'),
  goal_target_metric: yup
    .string()
    .trim()
    .max(100, 'Target metric must be less than 100 characters'),
  goal_deadline: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

const GoalInterventionReview = ({ 
  open, 
  onClose, 
  visit, 
  carePlans, 
  onSaveComplete,
  onCarePlanCreated,
  editingPlan = null,
  initialStep = 0,
  mode = 'care-plan' // 'care-plan', 'goal', 'intervention', 'review'
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [createdCarePlanId, setCreatedCarePlanId] = useState(null);
  const [createdGoalId, setCreatedGoalId] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [allGoalsWithInterventions, setAllGoalsWithInterventions] = useState([]);

  const notifyCarePlanCreated = (payload) => {
    if (typeof onCarePlanCreated === 'function') {
      onCarePlanCreated(payload);
    }
  };

  // Form validation
  const carePlanForm = useForm({
    resolver: yupResolver(carePlanSchema),
    defaultValues: {
      care_plan_title: editingPlan?.title || '',
      care_plan_description: editingPlan?.description || '',
      care_plan_status: editingPlan?.status || 'active',
    }
  });

  // Save goal without closing the dialog; returns new goal ID or null
  const saveGoalInline = async () => {
    try {
      setLoading(true);

      // Determine care plan ID in manage flow or after new care plan creation
      const carePlanId = editingPlan?.id || createdCarePlanId || formData.goal_care_plan_id;
      if (!carePlanId) {
        toast.error('Please select a care plan first');
        return null;
      }
      if (!formData.goal_title) {
        toast.error('Goal title is required');
        return null;
      }

      const goalPayload = {
        care_plan_id: carePlanId,
        title: formData.goal_title,
        notes: formData.goal_note,
        target_metric: formData.goal_target_metric,
        deadline: formData.goal_deadline,
      };

      const token = await GetToken();
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${Backend.auth}${Backend.carePlansGoals}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(goalPayload),
      });

      if (!response.ok) {
        toast.error('Failed to save goal');
        return null;
      }

      const savedGoal = await response.json();
      const newGoalId = savedGoal?.data?.id || savedGoal?.data?.goal?.id || savedGoal?.id;
      return newGoalId || null;
    } catch (error) {
      console.error('Inline goal save error:', error);
      toast.error('Failed to save goal');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const goalForm = useForm({
    resolver: yupResolver(goalSchema),
    defaultValues: {
      goal_title: editingPlan?.goal?.title || '',
      goal_note: editingPlan?.goal?.note || '',
      goal_target_metric: editingPlan?.goal?.target_metric || '',
      goal_deadline: editingPlan?.goal?.deadline || '',
    }
  });
  const [formData, setFormData] = useState({
    // Care Plan
    care_plan_title: editingPlan?.title || '',
    care_plan_description: editingPlan?.description || '',
    care_plan_status: editingPlan?.status || 'active',
    // Goal
    goal_care_plan_id: editingPlan?.id || '',
    goal_title: editingPlan?.goal?.title || '',
    goal_note: editingPlan?.goal?.note || '',
    goal_target_metric: editingPlan?.goal?.target_metric || '',
    goal_deadline: editingPlan?.goal?.deadline || '',
    // Intervention
    intervention_goal_id: editingPlan?.goal?.id || '',
    intervention_title: editingPlan?.interventions?.[0]?.title || '',
    intervention_instruction: editingPlan?.interventions?.[0]?.instruction || '',
    intervention_assigned_staff: editingPlan?.interventions?.[0]?.assigned_staff || '',
    intervention_deadline: editingPlan?.interventions?.[0]?.deadline || '',
    // Review
    review_goal_id: editingPlan?.goal?.id || '',
    review_reviewed_by: editingPlan?.reviews?.[0]?.reviewed_by || '',
    review_review_date: editingPlan?.reviews?.[0]?.review_date || '',
    review_note: editingPlan?.reviews?.[0]?.outcome || '',
    review_updated_goals: editingPlan?.reviews?.[0]?.updated_goals || [],
    review_updated_interventions: editingPlan?.reviews?.[0]?.updated_interventions || [],
  });

  const steps = [
    {
      label: 'Care Plan',
      icon: <AssignmentIcon />,
      description: 'Create the care plan that will contain goals',
    },
    {
      label: 'Goal',
      icon: <AssignmentIcon />,
      description: 'title, note, target metric, deadline (optional)',
    },
    {
      label: 'Intervention',
      icon: <MedicationIcon />,
      description: 'title, instruction, assigned staff (optional)',
    },
    {
      label: 'Review',
      icon: <ScheduleIcon />,
      description: 'reviewed by, review date, note, update goal/intervention (optional)',
    },
  ];

  const handleNext = async () => {
    // In goal mode, step 0 creates the care plan first
    if (mode === 'goal' && activeStep === 0) {
      try {
        setLoading(true);
        
        if (!formData.care_plan_title) {
          toast.error('Care Plan title is required');
          return;
        }

        const carePlanPayload = {
          visit_id: visit.visit_id,
          title: formData.care_plan_title,
          description: formData.care_plan_description,
          status: formData.care_plan_status,
        };

        const token = await GetToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
          'Content-Type': 'application/json',
        };

        console.log('Creating care plan with URL:', `${Backend.auth}${Backend.carePlans}`);
        console.log('Payload:', carePlanPayload);

        const response = await fetch(`${Backend.auth}${Backend.carePlans}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(carePlanPayload),
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('Success response:', result);
          const carePlanId = result.data?.id;
          setCreatedCarePlanId(carePlanId);
          setFormData({...formData, goal_care_plan_id: carePlanId});
          notifyCarePlanCreated(result);
          toast.success('Care Plan created! Now add your goal.');
          
          // Refresh the carePlans list to include the newly created one
          if (onSaveComplete) {
            await onSaveComplete();
          }
          
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          toast.error(`Failed to create care plan: ${response.status}`);
          throw new Error(`Failed to create care plan: ${response.status}`);
        }
      } catch (error) {
        console.error('Error creating care plan:', error);
        toast.error('Failed to create care plan');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'goal' && activeStep === 1) {
      // Optional: Save goal if filled, otherwise skip to intervention/review
      if (formData.goal_title && formData.goal_title.trim()) {
        // User has entered goal data, save it before proceeding
        if (!createdGoalId) {
          const gid = await saveGoalInline();
          if (gid) {
            setCreatedGoalId(gid);
            setFormData((prev) => ({ ...prev, intervention_goal_id: gid, review_goal_id: gid }));
          }
          // Continue even if save failed (user can select existing goal)
        }
      }
      // Allow proceeding without creating a goal - user can select existing goals
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      // For other steps, just move to next
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Fetch doctor list and interventions
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await GetToken();
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        
        // Fetch doctors
        const doctorResponse = await fetch(`${Backend.auth}${Backend.getDoctors}`, {
          method: 'GET',
          headers,
        });
        
        if (doctorResponse.ok) {
          const result = await doctorResponse.json();
          const doctorArr = result?.data?.data ?? result?.data ?? [];
          setStaffList(doctorArr);
        }
        
        // Fetch interventions for all goals
        const allGoals = (carePlans || []).flatMap(plan => (plan.goals || []));
        const goalsWithInterventions = await Promise.all(
          allGoals.map(async (goal) => {
            try {
              const intResponse = await fetch(`${Backend.auth}${Backend.carePlansInterventions}/${goal.id}`, {
                method: 'GET',
                headers,
              });
              
              if (intResponse.ok) {
                const intJson = await intResponse.json();
                const interventions = intJson?.data?.data ?? intJson?.data ?? [];
                return {
                  ...goal,
                  interventions: Array.isArray(interventions) ? interventions : [],
                };
              }
              return { ...goal, interventions: [] };
            } catch (err) {
              console.warn(`Failed to fetch interventions for goal ${goal.id}`, err);
              return { ...goal, interventions: [] };
            }
          })
        );
        
        setAllGoalsWithInterventions(goalsWithInterventions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    if (open) {
      fetchData();
    }
  }, [open, carePlans]);

  // Update activeStep when initialStep changes
  React.useEffect(() => {
    if (open) {
      setActiveStep(initialStep);
    }
  }, [initialStep, open]);

  const handleReset = () => {
    setActiveStep(initialStep);
    setCreatedCarePlanId(null);
    setCreatedGoalId(null);
    setFormData({
      care_plan_title: '',
      care_plan_description: '',
      care_plan_status: 'active',
      goal_care_plan_id: '',
      goal_title: '',
      goal_note: '',
      goal_target_metric: '',
      goal_deadline: '',
      intervention_goal_id: '',
      intervention_title: '',
      intervention_instruction: '',
      intervention_assigned_staff: '',
      intervention_deadline: '',
      review_goal_id: '',
      review_reviewed_by: '',
      review_review_date: '',
      review_note: '',
      review_updated_goals: [],
      review_updated_interventions: [],
    });
  };

  // Prepare all goals and interventions from care plans
  const allGoals = React.useMemo(() => {
    // Use the fetched goals with interventions if available, otherwise fall back to carePlans
    if (allGoalsWithInterventions.length > 0) {
      return allGoalsWithInterventions;
    }
    return (carePlans || []).flatMap(plan => (plan.goals || []));
  }, [carePlans, allGoalsWithInterventions]);

  const allInterventions = React.useMemo(() => {
    // Use the fetched goals with interventions to get all interventions
    if (allGoalsWithInterventions.length > 0) {
      return allGoalsWithInterventions.flatMap(goal => (goal.interventions || []));
    }
    return (carePlans || []).flatMap(plan => 
      (plan.goals || []).flatMap(goal => (goal.interventions || []))
    );
  }, [carePlans, allGoalsWithInterventions]);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Save only the care plan
  const handleSaveCarePlan = async (data) => {
    try {
      setLoading(true);

      const carePlanPayload = {
        visit_id: visit.visit_id,
        title: data.care_plan_title,
        description: data.care_plan_description,
        status: data.care_plan_status,
      };

      const token = await GetToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };

      console.log('Creating care plan (save only) with URL:', `${Backend.auth}${Backend.carePlans}`);
      console.log('Payload:', carePlanPayload);

      const response = await fetch(`${Backend.auth}${Backend.carePlans}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(carePlanPayload),
      });

      console.log('Save care plan response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Save care plan success:', result);
        const carePlanId = result.data?.id;
        setCreatedCarePlanId(carePlanId);
        notifyCarePlanCreated(result);
        toast.success('Care Plan created successfully! You can add goals later.');
        if (onSaveComplete) {
          await onSaveComplete();
        }
        handleClose();
      } else {
        const errorText = await response.text();
        console.error('Save care plan error:', errorText);
        toast.error(`Failed to create care plan: ${response.status}`);
        throw new Error(`Failed to create care plan: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating care plan:', error);
      toast.error('Failed to create care plan');
    } finally {
      setLoading(false);
    }
  };

  // Save only the goal
  const handleSaveGoal = async () => {
    try {
      setLoading(true);
      
      if (!formData.goal_title) {
        toast.error('Goal title is required');
        return;
      }

      // Use editingPlan ID if available, otherwise use createdCarePlanId
      const carePlanId = editingPlan?.id || createdCarePlanId;
      if (!carePlanId) {
        toast.error('Please select a care plan first');
        return;
      }

      const goalPayload = {
        care_plan_id: carePlanId,
        title: formData.goal_title,
        notes: formData.goal_note,
        target_metric: formData.goal_target_metric,
        deadline: formData.goal_deadline,
      };

      const token = await GetToken();
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${Backend.auth}${Backend.carePlansGoals}`, {
        method: 'POST',
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalPayload),
      });

      if (response.ok) {
        const savedGoal = await response.json();
        const newGoalId = savedGoal?.data?.id || savedGoal?.data?.goal?.id || savedGoal?.id;
        if (newGoalId) setCreatedGoalId(newGoalId);
        toast.success('Goal saved successfully! You can add interventions later.');
        if (onSaveComplete) {
          await onSaveComplete();
        }
        handleClose();
      } else {
        throw new Error('Failed to save goal');
      }
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  // Save intervention for an existing goal
  const handleSaveIntervention = async () => {
    try {
      setLoading(true);
      
      // Use selected goal or default order: createdGoalId -> editingPlan.goal.id -> first goal of editingPlan
      const goalId = formData.intervention_goal_id || createdGoalId || editingPlan?.goal?.id || editingPlan?.goals?.[0]?.id;
      if (!goalId) {
        toast.error('No goal available for this intervention');
        return;
      }
      
      if (!formData.intervention_title) {
        toast.error('Intervention title is required');
        return;
      }

      const interventionPayload = {
        care_plan_goal_id: goalId,
        title: formData.intervention_title,
        instructions: formData.intervention_instruction,
        assigned_staff_id: formData.intervention_assigned_staff,
        deadline: formData.intervention_deadline || "2025-12-31"
      };

      const token = await GetToken();
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${Backend.auth}${Backend.carePlansInterventions}`, {
        method: 'POST',
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(interventionPayload),
      });

      if (response.ok) {
        const savedIntervention = await response.json();
        toast.success('Intervention saved successfully! You can add reviews later.');
        if (onSaveComplete) {
          await onSaveComplete();
        }
        handleClose();
      } else {
        throw new Error('Failed to save intervention');
      }
    } catch (error) {
      console.error('Error saving intervention:', error);
      toast.error('Failed to save intervention');
    } finally {
      setLoading(false);
    }
  };

  // Save review for an existing goal
  const handleSaveReview = async () => {
    try {
      setLoading(true);
      
      // Use selected goal or default order: createdGoalId -> editingPlan.goal.id -> first goal of editingPlan
      const reviewGoalId = formData.review_goal_id || createdGoalId || editingPlan?.goal?.id || editingPlan?.goals?.[0]?.id;
      if (!reviewGoalId) {
        toast.error('No goal available for this review');
        return;
      }
      
      if (!formData.review_reviewed_by) {
        toast.error('Reviewer name is required');
        return;
      }

      const reviewPayload = {
        care_plan_goal_id: reviewGoalId,
        reviewed_by: formData.review_reviewed_by,
        review_date: formData.review_review_date,
        notes: formData.review_note,
        updated_goals: formData.review_updated_goals || [],
        updated_interventions: formData.review_updated_interventions || []
      };

      const token = await GetToken();
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${Backend.auth}${Backend.carePlansReviews}`, {
        method: 'POST',
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewPayload),
      });

      if (response.ok) {
        const savedReview = await response.json();
        toast.success('Review saved successfully!');
        if (onSaveComplete) {
          await onSaveComplete();
        }
        handleClose();
      } else {
        throw new Error('Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  // Save goal with intervention and review (all at once)
  const handleSaveGoalComplete = async () => {
    try {
      setLoading(true);
      
      // First save the goal
      if (!formData.goal_title) {
        toast.error('Goal title is required');
        return;
      }

      if (!createdCarePlanId && !formData.goal_care_plan_id) {
        toast.error('Please select a care plan first');
        return;
      }

      const goalPayload = {
        care_plan_id: createdCarePlanId || formData.goal_care_plan_id,
        title: formData.goal_title,
        notes: formData.goal_note,
        target_metric: formData.goal_target_metric,
        deadline: formData.goal_deadline,
      };

      const token = await GetToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };

      const goalResponse = await fetch(`${Backend.auth}${Backend.carePlansGoals}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(goalPayload),
      });

      if (!goalResponse.ok) {
        throw new Error('Failed to save goal');
      } else {
        const savedGoal = await goalResponse.json();
        const goalId = savedGoal?.data?.id || savedGoal?.data?.goal?.id || savedGoal?.id;

        // Then save the intervention if provided
        if (formData.intervention_title && goalId) {
          const interventionPayload = {
            care_plan_goal_id: goalId,
            title: formData.intervention_title,
            instructions: formData.intervention_instruction,
            assigned_staff_id: formData.intervention_assigned_staff,
            deadline: formData.intervention_deadline || "2025-12-31"
          };

          const interventionResponse = await fetch(`${Backend.auth}${Backend.carePlansInterventions}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(interventionPayload),
          });

          if (!interventionResponse.ok) {
            console.warn('Failed to save intervention, but goal was saved');
          }
        }

        // Finally save the review if provided
        if (formData.review_reviewed_by && goalId) {
          const reviewPayload = {
            care_plan_goal_id: goalId,
            reviewed_by: formData.review_reviewed_by,
            review_date: formData.review_review_date,
            notes: formData.review_note,
            updated_goals: formData.review_updated_goals || [],
            updated_interventions: formData.review_updated_interventions || []
          };

          const reviewResponse = await fetch(`${Backend.auth}${Backend.carePlansReviews}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(reviewPayload),
          });

          if (!reviewResponse.ok) {
            console.warn('Failed to save review, but goal was saved');
          }
        }
      }

      toast.success('Goal saved successfully with intervention and review!');
      if (onSaveComplete) {
        await onSaveComplete();
      }
      handleClose();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  // Save complete care plan (all at once)
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // First create the care plan
      if (!formData.care_plan_title) {
        toast.error('Care Plan title is required');
        return;
      }

      const token = await GetToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
        'Content-Type': 'application/json',
      };

      const carePlanPayload = {
        visit_id: visit.visit_id,
        title: formData.care_plan_title,
        description: formData.care_plan_description,
        status: formData.care_plan_status,
      };

      console.log('Creating care plan with URL:', `${Backend.auth}${Backend.carePlans}`);
      console.log('Payload:', carePlanPayload);

      const carePlanResponse = await fetch(`${Backend.auth}${Backend.carePlans}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(carePlanPayload),
      });

      console.log('Care plan response status:', carePlanResponse.status);

      if (!carePlanResponse.ok) {
        const errorText = await carePlanResponse.text();
        console.error('Care plan error:', errorText);
        toast.error(`Failed to create care plan: ${carePlanResponse.status}`);
        throw new Error(`Failed to create care plan: ${carePlanResponse.status}`);
      }

      const carePlanResult = await carePlanResponse.json();
      const carePlanId = carePlanResult.data?.id;

      // Then save the goal if provided
      let goalId = null;
      if (formData.goal_title) {
        const goalPayload = {
          care_plan_id: carePlanId,
          title: formData.goal_title,
          notes: formData.goal_note,
          target_metric: formData.goal_target_metric,
          deadline: formData.goal_deadline,
          status: 'active',
          priority: 'medium',
        };

        const goalResponse = await fetch(`${Backend.auth}${Backend.carePlansGoals}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(goalPayload),
        });

        if (!goalResponse.ok) {
          console.warn('Failed to save goal, but care plan was created');
        } else {
          const savedGoal = await goalResponse.json();
          goalId = savedGoal.id || savedGoal.care_plan_id;
        }
      }

      // Then save the intervention if provided and goalId exists
      if (formData.intervention_title && goalId) {
        const interventionPayload = {
          care_plan_goal_id: goalId,
          title: formData.intervention_title,
          instructions: formData.intervention_instruction,
          assigned_staff_id: formData.intervention_assigned_staff,
          deadline: formData.intervention_deadline || "2025-12-31"
        };

        const interventionResponse = await fetch(`${Backend.auth}${Backend.carePlansInterventions}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(interventionPayload),
        });

        if (!interventionResponse.ok) {
          console.warn('Failed to save intervention, but care plan and goal were saved');
        }
      }

      // Finally save the review if provided and goalId exists
      if (formData.review_reviewed_by && goalId) {
        const reviewPayload = {
          care_plan_goal_id: goalId,
          reviewed_by: formData.review_reviewed_by,
          review_date: formData.review_review_date,
          notes: formData.review_note,
          updated_goals: formData.review_updated_goals || [],
          updated_interventions: formData.review_updated_interventions || []
        };

        const reviewResponse = await fetch(`${Backend.auth}${Backend.carePlansReviews}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(reviewPayload),
        });

        if (!reviewResponse.ok) {
          console.warn('Failed to save review, but care plan and goal were saved');
        }
      }

      toast.success('Care plan created successfully!');
      if (onSaveComplete) {
        await onSaveComplete();
      }
      handleClose();
    } catch (error) {
      console.error('Error saving care plan:', error);
      toast.error('Failed to save care plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth={mode === 'care-plan' ? 'sm' : 'md'} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#E5E7EB',
          color: '#64748b',
          p: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            {(() => {
              if (mode === 'goal') {
                return <AddIcon sx={{ fontSize: 28, color: 'white' }} />;
              }
              if (mode === 'intervention') {
                return <MedicationIcon sx={{ fontSize: 26, color: 'white' }} />;
              }
              if (mode === 'review') {
                return <ScheduleIcon sx={{ fontSize: 26, color: 'white' }} />;
              }
              return editingPlan ? <EditIcon sx={{ fontSize: 28, color: 'white' }} /> : <AddIcon sx={{ fontSize: 28, color: 'white' }} />;
            })()}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#64748b' }}>
            {mode === 'care-plan' && (editingPlan ? 'Edit Care Plan' : 'Create New Care Plan')}
            {mode === 'goal' && 'Add Goal'}
            {mode === 'intervention' && 'Add Intervention'}
            {mode === 'review' && 'Add Review'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        {/* Care Plan Mode - Simple Form with Validation */}
        {mode === 'care-plan' && (
          <Box component="form" id="care-plan-form" onSubmit={carePlanForm.handleSubmit((data) => handleSaveCarePlan(data))}>
            <Controller
              name="care_plan_title"
              control={carePlanForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Care Plan Title"
                  error={!!error}
                  helperText={error?.message}
                  sx={{ mt: 2 }}
                  required
                />
              )}
            />
            <Controller
              name="care_plan_description"
              control={carePlanForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description (optional)"
                  multiline
                  rows={3}
                  error={!!error}
                  helperText={error?.message}
                  sx={{ mt: 2 }}
                />
              )}
            />
            <Controller
              name="care_plan_status"
              control={carePlanForm.control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth sx={{ mt: 2 }} error={!!error}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                  {error && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Box>
        )}

        {/* Goal Mode - Stepper with Care Plan, Goal, Intervention, Review */}
        {mode === 'goal' && (
          <Stepper activeStep={activeStep} orientation="vertical">
            {/* Step 0: Care Plan Creation */}
            <Step>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: activeStep >= 0 ? 'primary.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {activeStep > 0 ? <CheckCircleIcon /> : <LocalHospitalIcon />}
                  </Box>
                )}
              >
                <Typography variant="h6">Care Plan</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create the care plan first
                </Typography>
              </StepLabel>
              <StepContent>
                <Box>
                  <TextField 
                    fullWidth 
                    label="Care Plan Title" 
                    value={formData.care_plan_title} 
                    onChange={(e) => setFormData({...formData, care_plan_title: e.target.value})} 
                    sx={{ mb: 2 }} 
                    required
                  />
                  <TextField 
                    fullWidth 
                    label="Description (optional)" 
                    value={formData.care_plan_description} 
                    onChange={(e) => setFormData({...formData, care_plan_description: e.target.value})} 
                    multiline 
                    rows={3} 
                    sx={{ mb: 2 }} 
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select 
                      value={formData.care_plan_status} 
                      onChange={(e) => setFormData({...formData, care_plan_status: e.target.value})}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Continue to Goal'}
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>

            {/* Step 1: Goal */}
            <Step>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: activeStep >= 1 ? 'primary.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {activeStep > 1 ? <CheckCircleIcon /> : <AssignmentIcon />}
                  </Box>
                )}
              >
                <Typography variant="h6">Goal</Typography>
                <Typography variant="body2" color="text.secondary">
                  Define the care goal
                </Typography>
              </StepLabel>
              <StepContent>
                <Box>
                  {/* Show selected care plan info instead of dropdown */}
                  {editingPlan && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#ffffff', borderRadius: 2, border: `1px solid ${theme.palette.primary.main}33` }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        Adding goal to: {editingPlan.title || 'Selected Care Plan'}
                      </Typography>
                    </Box>
                  )}
                  <TextField 
                    fullWidth 
                    label="Goal Title" 
                    value={formData.goal_title} 
                    onChange={(e) => setFormData({...formData, goal_title: e.target.value})} 
                    sx={{ mb: 2 }} 
                  />
                  <TextField 
                    fullWidth 
                    label="Note" 
                    value={formData.goal_note} 
                    onChange={(e) => setFormData({...formData, goal_note: e.target.value})} 
                    multiline 
                    rows={3} 
                    sx={{ mb: 2 }} 
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Target Metric" 
                        value={formData.goal_target_metric} 
                        onChange={(e) => setFormData({...formData, goal_target_metric: e.target.value})} 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Deadline" 
                        type="date" 
                        value={formData.goal_deadline} 
                        onChange={(e) => setFormData({...formData, goal_deadline: e.target.value})} 
                        InputLabelProps={{ shrink: true }} 
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ 
                        mr: 1,
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }}
                      disabled={loading}
                    >
                      Continue
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSaveGoal}
                      disabled={loading}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          bgcolor: theme.palette.primary.light,
                        },
                      }}
                    >
                      Save Goal & Complete Later
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>

            {/* Step 2: Intervention */}
            <Step>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: activeStep >= 2 ? 'primary.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {activeStep > 2 ? <CheckCircleIcon /> : <MedicationIcon />}
                  </Box>
                )}
              >
                <Typography variant="h6">Intervention</Typography>
                <Typography variant="body2" color="text.secondary">
                  Define the intervention
                </Typography>
              </StepLabel>
              <StepContent>
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Goal</InputLabel>
                    <Select
                      label="Select Goal"
                      value={formData.intervention_goal_id || createdGoalId || editingPlan?.goals?.[0]?.id || ''}
                      onChange={(e) => setFormData({ ...formData, intervention_goal_id: e.target.value })}
                    >
                      {/* Show newly created goal if exists */}
                      {createdGoalId && formData.goal_title && (
                        <MenuItem key={createdGoalId} value={createdGoalId}>
                          {formData.goal_title} (Just Created)
                        </MenuItem>
                      )}
                      {/* Show goals from current care plan first */}
                      {editingPlan?.goals && editingPlan.goals.length > 0 && editingPlan.goals.map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.title || 'Untitled Goal'}
                        </MenuItem>
                      ))}
                      {/* Show all other goals from other care plans */}
                      {allGoals.filter(g => 
                        g.id !== createdGoalId && 
                        !(editingPlan?.goals || []).some(eg => eg.id === g.id)
                      ).map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.title || 'Untitled Goal'} (Other Care Plan)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField 
                    fullWidth 
                    label="Title" 
                    value={formData.intervention_title} 
                    onChange={(e) => setFormData({...formData, intervention_title: e.target.value})} 
                    sx={{ mb: 2 }} 
                  />
                  <TextField 
                    fullWidth 
                    label="Instruction" 
                    value={formData.intervention_instruction} 
                    onChange={(e) => setFormData({...formData, intervention_instruction: e.target.value})} 
                    multiline 
                    rows={3} 
                    sx={{ mb: 2 }} 
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Assigned Staff (optional)</InputLabel>
                    <Select
                      value={formData.intervention_assigned_staff}
                      onChange={(e) => setFormData({...formData, intervention_assigned_staff: e.target.value})}
                      label="Assigned Staff (optional)"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {staffList.map((staff) => {
                        const staffName = staff.name || staff.full_name || [staff.first_name, staff.last_name].filter(Boolean).join(' ').trim() || staff.username || staff.email || staff.id;
                        return (
                          <MenuItem key={staff.id} value={staff.id}>
                            {staffName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField 
                    fullWidth 
                    label="Deadline" 
                    type="date"
                    value={formData.intervention_deadline} 
                    onChange={(e) => setFormData({...formData, intervention_deadline: e.target.value})} 
                    InputLabelProps={{ shrink: true }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ 
                        mr: 1,
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }}
                      disabled={loading}
                    >
                      Continue
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSaveIntervention}
                      sx={{ 
                        mr: 1,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          bgcolor: theme.palette.primary.light,
                        },
                      }}
                      disabled={loading}
                    >
                      Save Intervention & Complete Later
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{
                        color: '#64748b',
                        '&:hover': {
                          bgcolor: '#f1f5f9',
                        },
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>

            {/* Step 3: Review */}
            <Step>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: activeStep >= 3 ? 'primary.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {activeStep > 3 ? <CheckCircleIcon /> : <ScheduleIcon />}
                  </Box>
                )}
              >
                <Typography variant="h6">Review</Typography>
                <Typography variant="body2" color="text.secondary">
                  Add review (optional)
                </Typography>
              </StepLabel>
              <StepContent>
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Goal to Review</InputLabel>
                    <Select
                      label="Select Goal to Review"
                      value={formData.review_goal_id || createdGoalId || editingPlan?.goals?.[0]?.id || ''}
                      onChange={(e) => setFormData({ ...formData, review_goal_id: e.target.value })}
                    >
                      {/* Show newly created goal if exists */}
                      {createdGoalId && formData.goal_title && (
                        <MenuItem key={createdGoalId} value={createdGoalId}>
                          {formData.goal_title} (Just Created)
                        </MenuItem>
                      )}
                      {/* Show goals from current care plan first */}
                      {editingPlan?.goals && editingPlan.goals.length > 0 && editingPlan.goals.map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.title || 'Untitled Goal'}
                        </MenuItem>
                      ))}
                      {/* Show all other goals from other care plans */}
                      {allGoals.filter(g => 
                        g.id !== createdGoalId && 
                        !(editingPlan?.goals || []).some(eg => eg.id === g.id)
                      ).map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.title || 'Untitled Goal'} (Other Care Plan)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Reviewed By</InputLabel>
                        <Select
                          value={formData.review_reviewed_by}
                          onChange={(e) => setFormData({...formData, review_reviewed_by: e.target.value})}
                          label="Reviewed By"
                        >
                          {staffList.map((staff) => {
                            const staffName = staff.name || staff.full_name || [staff.first_name, staff.last_name].filter(Boolean).join(' ').trim() || staff.username || staff.email || staff.id;
                            return (
                              <MenuItem key={staff.id} value={staff.id}>
                                {staffName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Review Date" 
                        type="date" 
                        value={formData.review_review_date} 
                        onChange={(e) => setFormData({...formData, review_review_date: e.target.value})} 
                        InputLabelProps={{ shrink: true }} 
                      />
                    </Grid>
                  </Grid>
                  <TextField 
                    fullWidth 
                    label="Note" 
                    value={formData.review_note} 
                    onChange={(e) => setFormData({...formData, review_note: e.target.value})} 
                    multiline 
                    rows={3} 
                    sx={{ mb: 2 }} 
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Updated Goals (optional)</InputLabel>
                    <Select
                      multiple
                      value={formData.review_updated_goals || []}
                      onChange={(e) => setFormData({...formData, review_updated_goals: e.target.value})}
                      label="Updated Goals (optional)"
                    >
                      {allGoals.map((goal) => (
                        <MenuItem key={goal.id} value={goal.id}>
                          {goal.title || 'Untitled Goal'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Updated Interventions (optional)</InputLabel>
                    <Select
                      multiple
                      value={formData.review_updated_interventions || []}
                      onChange={(e) => setFormData({...formData, review_updated_interventions: e.target.value})}
                      label="Updated Interventions (optional)"
                    >
                      {allInterventions.map((intervention) => (
                        <MenuItem key={intervention.id} value={intervention.id}>
                          {intervention.title || 'Untitled Intervention'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveReview}
                      disabled={loading}
                      sx={{ 
                        mr: 1,
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Save Review
                    </Button>
                    <Button
                      onClick={handleBack}
                      sx={{
                        color: '#64748b',
                        '&:hover': {
                          bgcolor: '#f1f5f9',
                        },
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        )}

        {/* Intervention Mode - Standalone */}

        {/* Intervention Mode */}
        {mode === 'intervention' && (
          <Box>
            {/* Show selected care plan and goal info */}
            {editingPlan && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#ffffff', borderRadius: 2, border: `1px solid ${theme.palette.primary.main}33` }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  Adding intervention to: {
                    (editingPlan?.goals || []).find(g => g.id === (createdGoalId || editingPlan?.goal?.id))?.title
                    || editingPlan?.goals?.[0]?.title
                    || 'Current goal'
                  }
                </Typography>
              </Box>
            )}
            <TextField 
              fullWidth 
              label="Title" 
              value={formData.intervention_title} 
              onChange={(e) => setFormData({...formData, intervention_title: e.target.value})} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Instruction" 
              value={formData.intervention_instruction} 
              onChange={(e) => setFormData({...formData, intervention_instruction: e.target.value})} 
              multiline 
              rows={3} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assigned Staff (optional)</InputLabel>
              <Select
                value={formData.intervention_assigned_staff}
                onChange={(e) => setFormData({...formData, intervention_assigned_staff: e.target.value})}
                label="Assigned Staff (optional)"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {staffList.map((staff) => {
                  const staffName = staff.name || staff.full_name || [staff.first_name, staff.last_name].filter(Boolean).join(' ').trim() || staff.username || staff.email || staff.id;
                  return (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staffName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField 
              fullWidth 
              label="Deadline" 
              type="date"
              value={formData.intervention_deadline} 
              onChange={(e) => setFormData({...formData, intervention_deadline: e.target.value})} 
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}

        {/* Review Mode */}
        {mode === 'review' && (
          <Box>
            {/* Show selected care plan and goal info */}
            {editingPlan && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#ffffff', borderRadius: 2, border: `1px solid ${theme.palette.primary.main}33` }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  Adding review to: {
                    (editingPlan?.goals || []).find(g => g.id === (createdGoalId || editingPlan?.goal?.id))?.title
                    || editingPlan?.goals?.[0]?.title
                    || 'Current goal'
                  }
                </Typography>
              </Box>
            )}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Reviewed By</InputLabel>
                  <Select
                    value={formData.review_reviewed_by}
                    onChange={(e) => setFormData({...formData, review_reviewed_by: e.target.value})}
                    label="Reviewed By"
                  >
                    {staffList.map((staff) => {
                      const staffName = staff.name || staff.full_name || [staff.first_name, staff.last_name].filter(Boolean).join(' ').trim() || staff.username || staff.email || staff.id;
                      return (
                        <MenuItem key={staff.id} value={staff.id}>
                          {staffName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Review Date" 
                  type="date" 
                  value={formData.review_review_date} 
                  onChange={(e) => setFormData({...formData, review_review_date: e.target.value})} 
                  InputLabelProps={{ shrink: true }} 
                />
              </Grid>
            </Grid>
            <TextField 
              fullWidth 
              label="Note" 
              value={formData.review_note} 
              onChange={(e) => setFormData({...formData, review_note: e.target.value})} 
              multiline 
              rows={3} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Updated Goals (optional)</InputLabel>
              <Select
                multiple
                value={formData.review_updated_goals || []}
                onChange={(e) => setFormData({...formData, review_updated_goals: e.target.value})}
                label="Updated Goals (optional)"
              >
                {allGoals.map((goal) => (
                  <MenuItem key={goal.id} value={goal.id}>
                    {goal.title || 'Untitled Goal'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Updated Interventions (optional)</InputLabel>
              <Select
                multiple
                value={formData.review_updated_interventions || []}
                onChange={(e) => setFormData({...formData, review_updated_interventions: e.target.value})}
                label="Updated Interventions (optional)"
              >
                {allInterventions.map((intervention) => (
                  <MenuItem key={intervention.id} value={intervention.id}>
                    {intervention.title || 'Untitled Intervention'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* OLD STEPPER CODE - Keep for reference but hide */}
        {false && <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: activeStep >= index ? 'primary.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {activeStep > index ? <CheckCircleIcon /> : step.icon}
                  </Box>
                )}
              >
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              
              <StepContent>
                {/* Care Plan Step */}
                {index === 0 && (
                  <Box>
                    <TextField 
                      fullWidth 
                      label="Care Plan Title" 
                      value={formData.care_plan_title} 
                      onChange={(e) => setFormData({...formData, care_plan_title: e.target.value})} 
                      sx={{ mb: 2 }} 
                      required
                    />
                    <TextField 
                      fullWidth 
                      label="Description (optional)" 
                      value={formData.care_plan_description} 
                      onChange={(e) => setFormData({...formData, care_plan_description: e.target.value})} 
                      multiline 
                      rows={3} 
                      sx={{ mb: 2 }} 
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Status</InputLabel>
                      <Select 
                        value={formData.care_plan_status} 
                        onChange={(e) => setFormData({...formData, care_plan_status: e.target.value})}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                )}

                {/* Goal Step */}
                {index === 1 && (
                  <Box>
                    {/* Select existing care plan if one wasn't just created */}
                    {!createdCarePlanId && (
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Care Plan</InputLabel>
                        <Select 
                          value={formData.goal_care_plan_id || ''} 
                          onChange={(e) => {
                            setFormData({...formData, goal_care_plan_id: e.target.value});
                            setCreatedCarePlanId(e.target.value);
                          }}
                        >
                          {(Array.isArray(carePlans) ? carePlans : []).map((plan) => (
                            <MenuItem key={plan.id} value={plan.id}>
                              {plan.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {createdCarePlanId && (
                      <Typography variant="body2" color="primary" sx={{ mb: 2, p: 1, bgcolor: 'primary.50', borderRadius: 1 }}>
                        Adding goal to: <strong>{carePlans?.find(p => p.id === createdCarePlanId)?.title || 'Current Care Plan'}</strong>
                      </Typography>
                    )}
                    <TextField 
                      fullWidth 
                      label="Goal Title" 
                      value={formData.goal_title} 
                      onChange={(e) => setFormData({...formData, goal_title: e.target.value})} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      label="Note" 
                      value={formData.goal_note} 
                      onChange={(e) => setFormData({...formData, goal_note: e.target.value})} 
                      multiline 
                      rows={3} 
                      sx={{ mb: 2 }} 
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth 
                          label="Target Metric" 
                          value={formData.goal_target_metric} 
                          onChange={(e) => setFormData({...formData, goal_target_metric: e.target.value})} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth 
                          label="Deadline" 
                          type="date" 
                          value={formData.goal_deadline} 
                          onChange={(e) => setFormData({...formData, goal_deadline: e.target.value})} 
                          InputLabelProps={{ shrink: true }} 
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Intervention Step */}
                {index === 2 && (
                  <Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Goal</InputLabel>
                      <Select 
                        value={formData.intervention_goal_id || (editingPlan?.goal?.id || '')} 
                        onChange={(e) => setFormData({...formData, intervention_goal_id: e.target.value})}
                      >
                        {(Array.isArray(carePlans) ? carePlans : []).flatMap((plan) => 
                          (plan.goals || []).map((goal) => (
                            <MenuItem key={goal.care_plan_id} value={goal.care_plan_id}>
                              {goal.title}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                    <TextField 
                      fullWidth 
                      label="Title" 
                      value={formData.intervention_title} 
                      onChange={(e) => setFormData({...formData, intervention_title: e.target.value})} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      label="Instruction" 
                      value={formData.intervention_instruction} 
                      onChange={(e) => setFormData({...formData, intervention_instruction: e.target.value})} 
                      multiline 
                      rows={3} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      label="Assigned Staff (optional)" 
                      value={formData.intervention_assigned_staff} 
                      onChange={(e) => setFormData({...formData, intervention_assigned_staff: e.target.value})} 
                      sx={{ mb: 2 }}
                    />
                    <TextField 
                      fullWidth 
                      label="Deadline" 
                      type="date"
                      value={formData.intervention_deadline} 
                      onChange={(e) => setFormData({...formData, intervention_deadline: e.target.value})} 
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                )}

                {/* Review Step */}
                {index === 3 && (
                  <Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Goal</InputLabel>
                      <Select 
                        value={formData.review_goal_id || (editingPlan?.goal?.id || '')} 
                        onChange={(e) => setFormData({...formData, review_goal_id: e.target.value})}
                      >
                        {(Array.isArray(carePlans) ? carePlans : []).flatMap((plan) => 
                          (plan.goals || []).map((goal) => (
                            <MenuItem key={goal.care_plan_id} value={goal.care_plan_id}>
                              {goal.title}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth 
                          label="Reviewed By" 
                          value={formData.review_reviewed_by} 
                          onChange={(e) => setFormData({...formData, review_reviewed_by: e.target.value})} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth 
                          label="Review Date" 
                          type="date" 
                          value={formData.review_review_date} 
                          onChange={(e) => setFormData({...formData, review_review_date: e.target.value})} 
                          InputLabelProps={{ shrink: true }} 
                        />
                      </Grid>
                    </Grid>
                    <TextField 
                      fullWidth 
                      label="Note" 
                      value={formData.review_note} 
                      onChange={(e) => setFormData({...formData, review_note: e.target.value})} 
                      multiline 
                      rows={3} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      label="Updated Goal (optional)" 
                      value={formData.review_updated_goal} 
                      onChange={(e) => setFormData({...formData, review_updated_goal: e.target.value})} 
                      sx={{ mb: 2 }} 
                    />
                    <TextField 
                      fullWidth 
                      label="Updated Intervention (optional)" 
                      value={formData.review_updated_intervention} 
                      onChange={(e) => setFormData({...formData, review_updated_intervention: e.target.value})} 
                    />
                  </Box>
                )}

                <Box sx={{ mb: 1 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleSave : handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={loading}
                  >
                    {index === steps.length - 1 ? 'Save Complete Plan' : 'Continue'}
                  </Button>
                  
                  {/* Save & Complete Later button for each step */}
                  {index === 0 && (
                    <Button
                      variant="outlined"
                      onClick={handleSaveCarePlan}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={loading}
                    >
                      Save Care Plan & Complete Later
                    </Button>
                  )}
                  {index === 1 && (
                    <Button
                      variant="outlined"
                      onClick={handleSaveGoal}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={loading}
                    >
                      Save Goal & Complete Later
                    </Button>
                  )}
                  {index === 2 && (
                    <Button
                      variant="outlined"
                      onClick={handleSaveIntervention}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={loading}
                    >
                      Save Intervention & Complete Later
                    </Button>
                  )}
                  {index === 3 && (
                    <Button
                      variant="outlined"
                      onClick={handleSaveReview}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={loading}
                    >
                      Save Review Only
                    </Button>
                  )}
                  
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', gap: 2 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            borderColor: '#cbd5e1',
            color: '#64748b',
            '&:hover': {
              borderColor: '#94a3b8',
              bgcolor: '#f1f5f9',
            },
          }}
        >
          Cancel
        </Button>
        
        {/* Save buttons for different modes */}
        {mode === 'care-plan' && (
          <Button
            variant="contained"
            type="submit"
            form="care-plan-form"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              bgcolor: '#22c55e',
              '&:hover': {
                bgcolor: '#16a34a',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Care Plan'}
          </Button>
        )}
        {mode === 'intervention' && (
          <Button
            variant="contained"
            onClick={handleSaveIntervention}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              bgcolor: '#22c55e',
              '&:hover': {
                bgcolor: '#16a34a',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Intervention'}
          </Button>
        )}
        {mode === 'review' && (
          <Button
            variant="contained"
            onClick={handleSaveReview}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              bgcolor: '#22c55e',
              '&:hover': {
                bgcolor: '#16a34a',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Review'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GoalInterventionReview;
