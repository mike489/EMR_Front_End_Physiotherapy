import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  Chip,
  useTheme,
} from '@mui/material';
import Backend from 'services/backend';
import GetToken from 'utils/auth-token';
import { toast, ToastContainer } from 'react-toastify';

const ResultLaboratory = ({ visit }) => {
  const [labResults, setLabResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();

  const handleFetchingLab = async () => {
    const token = await GetToken();
    const Api = `${Backend.auth}${Backend.patientLaboratories}/${visit.visit_id}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      setLoading(true);
      const response = await fetch(Api, { method: 'GET', headers: header });
      const responseData = await response.json();

      if (responseData.success) {
        setLabResults(responseData.data || []);
      } else {
        toast.warning(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleFetchingLab();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress sx={{ color: theme.palette.primary.light }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Grid item>
          <Typography
            variant="h8"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              // fontSize: { xs: '1.75rem', md: '2.125rem' },
            }}
          >
            Laboratory Results
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Review test results from your laboratory visits
          </Typography>
        </Grid>
      </Grid>

      {labResults.map((category, index) => (
        <Card
          key={index}
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'primary.dark',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                {category.group_name}
              </Typography>
              <Chip
                label={`${category.tests.length} tests`}
                size="small"
                sx={{
                  ml: 2,
                  backgroundColor: 'primary.light',
                  color: 'white',
                  fontSize: '0.7rem',
                }}
              />
            </Box>

            <Divider sx={{ my: 2, backgroundColor: 'grey.100' }} />

            <List dense disablePadding>
              {category.tests.map((test) => (
                <Paper
                  key={test.id}
                  elevation={0}
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: 'grey.50',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.lighter',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <ListItem alignItems="flex-start" disableGutters>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {test.test}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                minWidth: '70px',
                              }}
                            >
                              Result:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: 'success.dark',
                                ml: 1,
                              }}
                            >
                              {test.result}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                minWidth: '70px',
                              }}
                            >
                              Technician:
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {test.technician}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                minWidth: '70px',
                              }}
                            >
                              Date:
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {new Date(test.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      {labResults.length === 0 && !loading && (
        <Box
          textAlign="center"
          py={6}
          sx={{
            backgroundColor: 'grey.50',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No laboratory results available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Laboratory test results will appear here once they are available.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResultLaboratory;
