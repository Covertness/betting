import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    formControl: {
        margin: theme.spacing.unit,
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
            errorMessage: ''
        };
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    };

    handleLogin = () => {
        const { rtx, name, password } = this.state;

        // axios.post('/login', { rtx, name, password })
        //     .then(response => {
        //         console.log(response);
        //         localStorage.setItem('token', );
        //     })
        //     .catch(error => {
        //         console.error(error);
        //         this.setState({ errorOpen: true, errorMessage: error.message });
        //     });

        localStorage.setItem('token', 1);
        window.location.reload();
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

        return (
            <div>
                <div className={classes.root}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="rtx">RTX</InputLabel>
                        <Input id="rtx" value={this.state.rtx} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name">姓名</InputLabel>
                        <Input id="name" value={this.state.name} onChange={this.handleChange} />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="password">密码</InputLabel>
                        <Input id="password" value={this.state.password} onChange={this.handleChange} />
                        <FormHelperText id="password-helper-text">初次使用时此处输入要设置的密码</FormHelperText>
                    </FormControl>
                    <Button variant="raised" color="primary" className={classes.formControl} onClick={this.handleLogin}>登录</Button>
                    <Button variant="raised" color="primary" className={classes.formControl} onClick={this.handleForget}>忘记密码</Button>
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
                <Snackbar
                    ContentProps={{
                        'aria-describedby': 'message-id',
                        style: {
                            backgroundColor: '#d32f2f'
                        }
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={this.state.errorOpen}
                    onClose={this.handleErrorClose}
                    message={<span id="message-id">{this.state.errorMessage}</span>}
                />
            </div>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);