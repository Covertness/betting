import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import TabTitle from './TabTitle';

const styles = {
    root: {
        textAlign: 'center'
    },
    myBet: {
        display: 'flex',
        justifyContent: 'center'
    },
    myBetInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '15px 30px 15px 30px'
    },
    myBetCountNumber: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    myIncomeNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red'
    },
    myBetPrompt: {
        fontSize: 20,
        color: '#cebf88',
        marginTop: 5
    },
    user: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: 10
    },
    rankNum: {
        fontSize: 20,
        width: 15
    },
    myItem: {
        backgroundColor: 'red'
    }
};

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#294177',
        color: theme.palette.common.white,
        padding: '4px 14px 4px 14px'
    },
    body: {
        padding: '4px 14px 4px 14px'
    },
}))(TableCell);

class RankTab extends React.Component {
    render() {
        const { classes, label, ranks, userInfo } = this.props;

        return (
            <div className={classes.root}>
                <TabTitle icon='rank' label={label} />
                <div className={classes.myBet}>
                    <div className={classes.myBetInfo}>
                        <label className={classes.myBetCountNumber}>{userInfo.rank}</label>
                        <label className={classes.myBetPrompt}>我的排名</label>
                    </div>
                    <div style={{margin: '15px 0 15px 0', width: 2, height: 50, backgroundColor: '#cebf88'}}></div> 
                    <div className={classes.myBetInfo}>
                        <label className={classes.myIncomeNumber}>
                            {userInfo.income > 0 ? '+' + userInfo.income : userInfo.income}
                        </label>
                        <label className={classes.myBetPrompt}>我的金币</label>
                    </div>
                </div>
                <Table className={classes.rankTable}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>名次</CustomTableCell>
                            <CustomTableCell>名字</CustomTableCell>
                            <CustomTableCell>获胜场次</CustomTableCell>
                            <CustomTableCell>金币</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ranks.reduce((acc, n, i) => {
                            const myselfStyle = (n.id === userInfo.id && i < 10) ? classes.myItem : null;

                            const { id, nickName, avatarUrl, betCount, winCount, money } = n;
                            return acc.concat(
                                <TableRow classes={{root: myselfStyle}} key={id}>
                                    <CustomTableCell>
                                        {this.renderRankNum(i + 1)}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <div className={classes.user}>
                                            <Avatar
                                                alt={nickName}
                                                src={avatarUrl}
                                                className={classes.avatar}
                                            />
                                            <label className={classes.nickName}>{nickName}</label>
                                        </div>
                                    </CustomTableCell>
                                    <CustomTableCell>{winCount + '/' + betCount}场</CustomTableCell>
                                    <CustomTableCell>{money}币</CustomTableCell>
                                </TableRow>
                            );
                        }, [])}
                    </TableBody>
                </Table>
            </div>
        )
    }

    renderRankNum = (rank) => {
        const { classes } = this.props;
        switch (rank) {
            case 1: {
                return <img className={classes.rankNum} src="img/champion.png" alt="champion" />
            }
            case 2: {
                return <img className={classes.rankNum} src="img/second-place.png" alt="second-place" />
            }
            case 3: {
                return <img className={classes.rankNum} src="img/third-place.png" alt="third-place" />
            }
            default: {
                return <label className={classes.rankNum}>{rank}</label>
            }
        }
    }
}

RankTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RankTab);