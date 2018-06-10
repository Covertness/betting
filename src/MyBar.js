import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CountUp from 'react-countup';

const styles = {
    row: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: 60,
        height: 60,
    },
    user: {
        display: 'flex',
        alignItems: 'center'
    },
    nickName: {
        fontWeight: 'bold'
    },
    money: {
        display: 'flex',
        alignItems: 'center',
        margin: 15,
        color: '#cebf88',
        backgroundColor: '#2a2d3a',
        borderRadius: 10,
        padding: 10
    },
    moneyIcon: {
        marginLeft: 5,
        marginRight: 10
    },
    moneyText: {
        textAlign: 'center',
        minWidth: 60
    },
    button: {
        marginLeft: 10,
        marginRight: 3,
        transform: 'scale(0.8)',
        color: 'Black',
        backgroundColor: 'White'
    }
};

let oldMoney = 0;

function MyBar(props) {
    const { classes, userInfo } = props;
    const { nickName, avatarUrl, money } = userInfo;

    let startMoney = oldMoney;
    oldMoney = money;

    return (
        <div className={classes.row}>
            <div className={classes.user}>
                <Avatar
                    alt={nickName}
                    src={avatarUrl}
                    className={classNames(classes.avatar, classes.bigAvatar)}
                />
                <label className={classes.nickName}>{nickName}</label>
            </div>
            <div className={classes.money}>
                <img className={classes.moneyIcon} src="img/money.png" alt="money" />
                <label className={classes.moneyText}><CountUp start={startMoney} end={money} />金币</label>
                {/* <Button variant="fab" mini color="secondary" aria-label="add" className={classes.button}>
                    <AddIcon />
                </Button> */}
            </div>
        </div>
    );
}

MyBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyBar);