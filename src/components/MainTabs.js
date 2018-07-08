import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import RankTab from '../containers/MyRankTab';
import BetTab from '../containers/BetTab';
import ScheduleTab from '../containers/ScheduleTab';
import MyTab from '../containers/MyHistoryTab';

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper
    },
    tabContent: {
        paddingBottom: 80
    },
    tabLabels: {
        position: 'fixed',
        bottom: 0
    },
    tabLabel: {
        maxWidth: 'none'
    }
});

class MainTabs extends React.Component {
    state = {
        value: 0
    };

    handleChange = (event, value) => {
        window.scrollTo(0, 0);
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <SwipeableViews
                    className={classes.tabContent}
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                >
                    <TabContainer dir={theme.direction}><ScheduleTab label="赛程" /></TabContainer>
                    <TabContainer dir={theme.direction}><BetTab label="投注" /></TabContainer>
                    <TabContainer dir={theme.direction}><RankTab label="排名" /></TabContainer>
                    <TabContainer dir={theme.direction}><MyTab label="投注记录" /></TabContainer>
                </SwipeableViews>
                <AppBar position="static" color="default" className={classes.tabLabels}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        <Tab label="赛程" icon={this.tabIcon("schedule")} className={classes.tabLabel} />
                        <Tab label="投注" icon={this.tabIcon("bet")} className={classes.tabLabel} />
                        <Tab label="排名" icon={this.tabIcon("rank")} className={classes.tabLabel} />
                        <Tab label="我的" icon={this.tabIcon("my")} className={classes.tabLabel} />
                    </Tabs>
                </AppBar>
            </div>
        );
    }

    tabIcon = (alt) => <img src={"img/" + alt + ".png"} alt={alt} height="30" width="30" />
}

MainTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MainTabs);