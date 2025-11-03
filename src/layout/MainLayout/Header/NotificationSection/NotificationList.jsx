import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Add useNavigate for redirection
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { NotificationRedirection } from 'utils/notification-redirection'; // Import for redirection
import Chip from 'ui-component/extended/Chip';
import { TimeAgo } from 'utils/time-ago';
import User1 from 'assets/images/users/user-round.svg';

const ListItemWrapper = ({ children, onClick }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.primary.light,
        },
      }}
      onClick={onClick} // Move onClick to ListItemWrapper
    >
      {children}
    </Box>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func, // Add onClick prop
};

const NotificationList = ({ notification, onPress }) => {
  const theme = useTheme();
  const navigate = useNavigate(); 

 
  const handleViewDetails = () => {
    NotificationRedirection(notification.body, navigate);
  };

  return (
    <List
      sx={{
        py: 0,
        '& .MuiListItemSecondaryAction-root': {
          top: 12,
        },
        '& .MuiDivider-root': {
          my: 0,
        },
        '& .list-container': {
          pl: 7,
        },
        backgroundColor:
          notification.read_at === null ? theme.palette.grey[100] : 'inherit',
      }}
    >
      <ListItemWrapper onClick={() => onPress(notification)}> 
        <ListItem
          // secondaryAction={
          //   <Button
          //     variant="text"
          //     color="primary"
          //     onClick={handleViewDetails} 
          //   >
          //     View Details
          //   </Button>
          // }
        >
          <Grid container justifyContent="flex-end">
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}
              >
                <Avatar
                  alt={notification.name}
                  src={User1}
                  sx={{ width: 30, height: 30, marginRight: 1.4 }}
                />
                <Typography variant="h5">{notification.name}</Typography>
              </Box>

              <Typography
                variant="caption"
                display="block"
                gutterBottom
                textTransform="capitalize"
              >
                {TimeAgo(notification.created_at)}
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 0.5 }}>
            <Typography variant="">{notification.title}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="subtitle2">{notification.body?.message}</Typography>
          </Grid>
        </Grid>
      </ListItemWrapper>
    </List>
  );
};

NotificationList.propTypes = {
  notification: PropTypes.object,
  onPress: PropTypes.func,
};

export default NotificationList;