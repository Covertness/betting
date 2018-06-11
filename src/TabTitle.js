import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    row: {
        width: '100%',
        height: 100,
        fontSize: 20,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("img/tab-title-bg.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
        padding: 5,
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5
    },
    button: {
        position: 'absolute',
        backgroundColor: 'Transparent',
        border: 'none',
        right: 5
    }
};

function TabTitle(props) {
    const { classes, icon, label, onQuestionClick } = props;

    return (
        <div className={classes.row}>
            <img src={"img/" + icon + ".png"} alt={icon} className={classes.icon} />
            <label>{label}</label>
            {label === '赛程' && (
                <button className={classes.button} onClick={onQuestionClick}>
                    <img src="./img/question.png" alt="question" width={50} />
                </button>
            )}
        </div>
    );
}

TabTitle.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TabTitle);