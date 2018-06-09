import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import ErrorSnackbar from './ErrorSnackbar';
import axios from 'axios';
import { Config } from './Config';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    loadingRoot: {
        opacity: 0.5
    },
    logo: {
        width: 150,
        marginTop: 50,
    },
    formControl: {
        margin: theme.spacing.unit,
        width: '90%'
    },
    helpControl: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    help: {
        marginLeft: 2,
        color: 'grey',
        fontSize: 12
    },
    forget: {
    },
    loading: {
        top: '50%',
        left: '50%',
        position: 'absolute',
        zIndex: 2,
        marginTop: -50,
        marginLeft: -50
    }
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rtx: '',
            name: '',
            password: '',
            forgetOpen: false,
            errorOpen: false,
            errorMessage: '',
            loading: false
        };
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    handleLogin = () => {
        const { rtx, name, password } = this.state;

        this.setState({ loading: true });

        axios.post(Config.host + '/authorize', { en_name: rtx, ch_name: name, password })
            .then(response => {
                console.log(response);
                localStorage.setItem('token', response.data.user_id);
                window.location.href = window.location.href + '?time=' + ((new Date()).getTime());
            })
            .catch(error => {
                console.error(error);
                this.setState({ loading: false, errorOpen: true, errorMessage: error.response.data.desc || error.message });
            });
    }

    handleForget = () => {
        this.setState({ forgetOpen: true });
    }

    handleForgetClose = () => {
        this.setState({ forgetOpen: false });
    };

    handleErrorClose = () => {
        this.setState({ errorOpen: false });
    };

    render() {
        const { classes } = this.props;
        const { loading } = this.state;

        return (
            <div>
                <div className={loading ? classNames(classes.loadingRoot, classes.root) : classes.root}>
                    <img src="./img/login-logo.png" alt="logo" className={classes.logo} />
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="rtx">RTX账号</InputLabel>
                        <Input id="rtx" startAdornment={
                            <InputAdornment position="start">
                                {this.formControlIcon('login-rtx')}
                            </InputAdornment>
                        } value={this.state.rtx} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name">中文名</InputLabel>
                        <Input id="name" startAdornment={
                            <InputAdornment position="start">
                                {this.formControlIcon('login-name')}
                            </InputAdornment>
                        } value={this.state.name} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="password">密码</InputLabel>
                        <Input id="password" startAdornment={
                            <InputAdornment position="start">
                                {this.formControlIcon('login-password')}
                            </InputAdornment>
                        } type="password" value={this.state.password} onChange={this.handleChange} />
                        <FormHelperText id="password-helper-text">初次使用时此处输入要设置的密码</FormHelperText>
                    </FormControl>
                    <div className={classNames(classes.helpControl, classes.formControl)}>
                        <div>
                            <img src="img/login-help.png" alt="help" height="10" width="10" />
                            <label className={classes.help}>身份验证遇到问题，请联系管理员</label>
                        </div>
                        <Button color="primary" className={classes.forget} onClick={this.handleForget}>重置密码</Button>
                    </div>
                    <Button variant="raised" color="primary" className={classes.formControl} disabled={loading} onClick={this.handleLogin}>登录</Button>
                </div>
                <Dialog
                    open={this.state.forgetOpen}
                    onClose={this.handleForgetClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">温馨提示</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">我忘记了密码。</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleForgetClose} color="primary">好的</Button>
                    </DialogActions>
                </Dialog>
                <ErrorSnackbar open={this.state.errorOpen} onClose={this.handleErrorClose} message={this.state.errorMessage} />
                {loading && <CircularProgress className={classes.loading} size={100} />}
            </div>
        );
    }

    formControlIcon = (alt) => <img src={"img/" + alt + ".png"} alt={alt} height="20" width="20" />
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);