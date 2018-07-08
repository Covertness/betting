import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import ErrorSnackbar from '../components/ErrorSnackbar';
import { loginAction, fetchRounds, fetchCountries, fetchHistory, showErrorAction } from '../actions'

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
            loading: false
        };
        this.dispatch = props.dispatch;
    }

    componentDidMount = () => {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            this.setState(JSON.parse(credentials));
            this.handleLogin();
        }
    };

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    handleLogin = () => {
        this.setState({ loading: true });

        this.fetchAll().then(() => {
            const { rtx, name, password } = this.state;
            this.props.onLogin({ rtx, name, password });
        }, error => {
            console.error('An error occurred.', error);
            this.showError('Fetching all failed.');
        });
    }

    handleErrorClose = () => {
        this.props.hideError();
    };

    render() {
        const { classes, errorMessage } = this.props;
        const { loading } = this.state;

        return (
            <div>
                <div className={loading ? classNames(classes.loadingRoot, classes.root) : classes.root}>
                    <img src="./img/login-logo.png" alt="logo" className={classes.logo} />
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="rtx">账号</InputLabel>
                        <Input id="rtx" startAdornment={
                            <InputAdornment position="start">
                                {this.formControlIcon('login-rtx')}
                            </InputAdornment>
                        } value={this.state.rtx} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name">昵称</InputLabel>
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
                    </FormControl>
                    <div className={classNames(classes.helpControl, classes.formControl)}>
                        <div>
                            <img src="img/login-help.png" alt="help" height="10" width="10" />
                            <label className={classes.help}>身份验证遇到问题，请联系管理员</label>
                        </div>
                    </div>
                    <Button variant="raised" color="primary" className={classes.formControl} disabled={loading} onClick={this.handleLogin}>登录</Button>
                </div>
                <ErrorSnackbar open={errorMessage.show} onClose={this.handleErrorClose} message={errorMessage.content} />
                {loading && <CircularProgress className={classes.loading} size={100} />}
            </div>
        );
    }

    fetchAll = async () => {
        await this.props.fetchSchedules();
        await this.props.fetchHistory();
    }


    showError = content => {
        this.props.showError(content);
    }

    formControlIcon = (alt) => <img src={"img/" + alt + ".png"} alt={alt} height="20" width="20" />
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapStateToProps = state => {
    return {
        errorMessage: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSchedules: () => {
            return dispatch(fetchRounds()).then(() => {
                dispatch(fetchCountries());
            });
        },
        fetchHistory: () => dispatch(fetchHistory()),
        onLogin: credentials => {
            dispatch(loginAction(credentials));
        },
        showError: (message) => dispatch(showErrorAction(true, message))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));