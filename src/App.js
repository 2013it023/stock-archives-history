import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuBar from './navbar/MenuBar'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import CommentIcon from '@material-ui/icons/Comment';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import LineChart from 'react-linechart';

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);

const styles = theme =>({
    root: {
        marginTop: '16px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width:80+'%',
    },
    input: {
        marginLeft: 8,
        flex: 1,
        '&:focus': {
            width: 'blue',
        },
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
    list: {
        marginTop: '16px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        borderBottom:'1px solid lightgray',
        height: '6vh',
    },
    title: {
        display: 'none',
        width:100+'px',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    dialogRoot: {
        width:'100%',
    },
    dialogTitle: {
        width: '100%',
    },
    dialogContent: {
        display: 'flex',
        padding:'16px',
    },
    insideContent: {
        padding:'16px',
    },
    checkBox: {
        maxWidth: '0%',
    },
    stockDate: {
        textAlign: 'center',
        maxWidth: '10%',
    },
    companyName: {
        textAlign: 'center',
        maxWidth: '10%',
    },
    openingBalance: {
        textAlign: 'center',
        maxWidth: '10%',
    },
    closingBalance: {
        textAlign: 'center',
        maxWidth: '10%',
    },
    low: {
        textAlign: 'center',
        maxWidth:'10%',
    },
    high: {
        textAlign: 'center',
        maxWidth: '10%',
    },
    volume:  {
        textAlign: 'center',
        maxWidth: '10%',
    },
    history: {
        textAlign: 'center',
        maxWidth:'5%',
    },
    divider: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
    },
    largeIcon: {
        width: 60,
        height: 60,
    },
});

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fetch('http://localhost:8080/stack/archives/history/getAllStackArchives')
            .then(res => res.json())
            .then((result) => {
                    this.setState({ stockList: result });
                },
                (error) => {
                    this.setState({ stockList: [] });
                }
            );
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    trackScrolling = () => {
        const wrappedElement = document.body;
        if (this.isBottom(wrappedElement)) {
            console.log('header bottom reached');
        }
    };

    state = {
        checked: [0],
        open: false,
        stockList: [],
        singleStock: [],
        visibility: false,
        chartDialog: false,
        data: [],
    };

    handleToggle = value => (event) => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        if(event.target.tagName !== 'INPUT' && event.target.tagName !== 'path' && event.target.tagName !== 'BUTTON') {
            fetch('http://localhost:8080/stack/archives/history/getStackArchives?uniqueId='+value)
                .then(res => res.json())
                .then((result) => {
                        this.setState({singleStock: result,
                            open: true,
                            visibility:false,});
                    },
                    (error) => {
                        this.setState({ singleStock: [],
                            visibility:true});
                    }
                );
        } else if(event.target.tagName === 'path' || event.target.tagName === 'BUTTON') {
            let uniqueId = value;
            fetch('http://localhost:8080/stack/archives/history/generateStockHistory?uniqueId='+value)
                .then(res => res.json())
                .then((result) => {
                        let options = {
                            color: 'steelblue',
                            points: result,
                        };
                        this.setState({
                            chartDialog: true,
                            data: [options],
                        });
                });
        }
        this.setState({
            checked: newChecked,
        });
    };

    handleClose = () => {
        this.setState({ open: false, chartDialog:false});
    };

    handleSearchBar = (event) => {
        let value = event.target.value;
        fetch('http://localhost:8080/stack/archives/history/searchStackByKeyword?keyword='+value)
            .then(res => res.json())
            .then((result) => {
                    if(result.length !== 0) {
                        this.setState({ stockList: result,
                            visibility:false});
                    } else {
                        this.setState({ stockList: [],
                            visibility:true});
                    }
                },
                (error) => {
                    this.setState({ stockList: [],
                        visibility:true });
                }
            );
    };

    render() {
        var shown = {
            display: "block",
            width: 60+'vh',
            height: 60+'%',
            marginRight: 'auto',
            marginLeft: 'auto',
            marginTop: '25vh',
            fontSize: '1.4rem',
        };
        var hidden = {
            display: "none",
            margin: "auto",
        };

        const{classes} = this.props;
        return (
            <div className="">
                <div>
                    <MenuBar></MenuBar>
                </div>
                <Paper className={classes.root} elevation={1}>
                    <InputBase className={classes.input} placeholder="Search Stock by symbol, Please click search button." fullWidth type="text" onChange={this.handleSearchBar}/>
                    <IconButton className={classes.iconButton} aria-label="Search">
                      <SearchIcon />
                    </IconButton>
                </Paper>
                <div>
                    <List className={classes.list}>
                        <ListItem>
                            <ListItemText
                                primary="" className={classes.checkBox}/>
                            <ListItemText
                                primary="Stock Date" className={classes.stockDate}/>
                            <ListItemText
                                primary="Symbol" className={classes.companyName}/>
                            <ListItemText
                                primary="Open" className={classes.openingBalance}/>
                            <ListItemText
                                primary="Close" className={classes.closingBalance}/>
                            <ListItemText
                                primary="Low" className={classes.low}/>
                            <ListItemText
                                primary="High" className={classes.high}/>
                            <ListItemText
                                primary="Volume" className={classes.volume}/>
                            <ListItemText
                                primary="History" className={classes.history}/>
                        </ListItem>
                    </List>
                </div>
                <Divider className={classes.divider}/>
                <div>
                    <List className={classes.list}>
                        {this.state.stockList.map(value => (
                            <ListItem key={value.uniqueId} role={undefined} dense button onClick={this.handleToggle(value.uniqueId)} className={classes.listItem}>
                                <Checkbox
                                    tabIndex={-1}
                                    disableRipple
                                    color="primary"
                                    className={classes.checkBox}
                                />
                                <ListItemText secondary={value.date} className={classes.stockDate}/>
                                <ListItemText primary={value.symbol} className={classes.companyName}/>
                                <ListItemText secondary={value.open} className={classes.openingBalance}/>
                                <ListItemText secondary={value.close} className={classes.closingBalance}/>
                                <ListItemText secondary={value.low} className={classes.low}/>
                                <ListItemText secondary={value.high} className={classes.high}/>
                                <ListItemText primary ={value.volume} className={classes.volume}/>
                                    <Tooltip title="Show History">
                                        <IconButton aria-label="Comments" className={classes.history}>
                                            <CommentIcon />
                                        </IconButton>
                                    </Tooltip>
                            </ListItem>
                        ))}
                    </List>
                    <Typography gutterBottom style={this.state.visibility ? shown : hidden}>
                        No Search Resul Found.Try Another Keyword.
                    </Typography>
                    <Dialog
                        onClose={this.handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={this.state.open}
                    >
                        <DialogTitle id="customized-dialog-title" onClose={this.handleClose} className={classes.dialogTitle}>
                            {this.state.singleStock.symbol} of {this.state.singleStock.date}
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent} >
                            <Typography gutterBottom className={classes.insideContent}>
                                Opening Amount: {this.state.singleStock.open}
                            </Typography>
                            <Typography gutterBottom className={classes.insideContent}>
                                Closing Amount: {this.state.singleStock.close}
                            </Typography>
                            <Typography gutterBottom className={classes.insideContent}>
                                Volume: {this.state.singleStock.volume}
                            </Typography>
                        </DialogContent>
                    </Dialog>
                    <Dialog
                        open={this.state.chartDialog}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                        onClose={this.handleClose}
                    >
                        <DialogTitle id="alert-dialog-slide-title" onClose={this.handleClose} className={classes.dialogTitle}>
                            Stock History
                        </DialogTitle>
                        <DialogContent>
                            <LineChart
                                width={600}
                                height={400}
                                data={this.state.data}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
    );
  }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
