import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Input } from '@material-ui/core';

class App extends React.Component{

    constructor(){
        super();
        this.state = {
            tasks : [],
            newTask : {
                task: '',
                status: ''
            },
            updateStatus: true
        };
        this.changeState = this.changeState.bind(this);

        this.handleTaskChange = this.handleTaskChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);

        this.createTask = this.createTask.bind(this);

        this.updateStatus = this.updateStatus.bind(this);

        this.handleTaskUpdateChange = this.handleTaskUpdateChange.bind(this);
        this.handleStatusUpdateChange = this.handleStatusUpdateChange.bind(this);
    };

    handleTaskChange(task){
        console.log('INSIDE TASK CHANGE ');
        this.setState({
            newTask : {
                task: task.target.value,
                status: this.state.newTask.status
            }
        });
        console.log(this.state.newTask.task);
    };

    handleStatusChange(status){
        console.log('INSIDE STATUS CHANGE ');
        this.setState({
            newTask : {
                task : this.state.newTask.task,
                status : status.target.value
            }
        });
        console.log(this.state.newTask.status);
    };

    changeState(){
        console.log("INSIDE CHANGE STATE");
        fetch('http://localhost:5000/tasks')
        .then(result => {
            return result.json();
        })
        .then(result => {
            console.log("FETCH RESPONSE : ",result);
            this.setState({
                tasks : result
            });
        });
    };

    componentWillMount(){
        console.log('INSIDE COMPONENT WILL MOUNT')
        this.changeState();
    };

    deleteRow(data){
        console.log('INSIDE DELETEROW')
        fetch('http://localhost:5000/tasks/'+data.id, {
            method : 'delete'
        })
        .then(response => { return response.json()})
        .then(response => console.log("DELETE RESPONSE : ", response))
        .then(() => this.changeState());
    };

    createTask(event){
        
        console.log('INSIDE CREATE TASK : ');
        
        var task = {
            task : this.state.newTask.task,
            status : this.state.newTask.status
        }
        console.log(task);
        fetch('http://localhost:5000/tasks' , {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(task)
        })
        .then(response => { return response.json() })
        .then(response => console.log(response))
        .then(() => this.changeState());

        event.preventDefault();
    };

    updateStatus(data){
        console.log(data);
        if(this.state.updateStatus){
            this.setState({
                updateStatus : false
            });
        }
        else{
            var updateTask = {
                task : data.task,
                status: data.status
            }
            console.log('updateData = ',updateTask)
            fetch('http://localhost:5000/tasks/'+data.id , {
                method : 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(updateTask)
            })
            .then(response => { return response.json() })
            .then(response => console.log(response))
            .then(
                () => this.setState({
                    updateStatus : true
                })
            )
            .then( () => this.changeState() );
        };
    };

    handleTaskUpdateChange(task){
        var copiedState = this.state;
        copiedState.tasks[task.target.getAttribute('id')].task = task.target.value;

        this.setState({
            state: copiedState
        });
    }

    handleStatusUpdateChange(task){
        var copiedState = this.state;
        copiedState.tasks[task.target.getAttribute('id')].status = task.target.value;

        this.setState({
            state: copiedState
        });
    }

    render(){
        return (
            <div>
                Hii Mysql

                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>TASK</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell>CREATED_AT</TableCell>
                            <TableCell>DELETE</TableCell>
                            <TableCell>UPDATE</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {this.state.tasks.map((data , i ) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>{data.id}</TableCell>
                                    <TableCell>
                                        <Input type='text' id={''+i} value={data.task} onChange={this.handleTaskUpdateChange} readOnly={this.state.updateStatus} /> 
                                    </TableCell>
                                    <TableCell>
                                        <Input type='text' id={''+i} value={data.status} onChange={this.handleStatusUpdateChange} readOnly={this.state.updateStatus} />
                                    </TableCell>
                                    <TableCell>{data.created_at}</TableCell>
                                    <TableCell><Button onClick={() => this.deleteRow(data)}>Delete</Button></TableCell>
                                    <TableCell><Button onClick={() => this.updateStatus(data)}>Update</Button></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>

                </Table>

                <form onSubmit={this.createTask}>
                    TASK : <input type='text'   onChange={this.handleTaskChange} />
                    STATUS : <input type='text'  onChange={this.handleStatusChange} />
                    <input type='submit' value='Submit' />
                </form>

            </div>
        );
    }
}

export default App;