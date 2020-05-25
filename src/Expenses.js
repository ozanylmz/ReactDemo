import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import { Container, Form, FormGroup, Button, Label, Input, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';

class Expenses extends Component {

    emptyItem = {
        expenseDate : new Date(),
        descript : '',
        id : 104,
        location : '',
        category : {id:1, name:''}
    }

    constructor(props){
        super(props);

        this.state = { 
            date : new Date(),
            isLoading : true,
            expenses : [],
            categories : [],
            item : this.emptyItem
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
        console.log(item);
    }

    handleSelectChange(event){
 
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item.category.id = value;
        let i = [...this.state.categories].filter(i => i.id == value);
        item.category.name = i[0].name;
        this.setState({item});
        
    }

    handleDateChange(date){
        let item = {...this.state.item};
        item.expenseDate = date;
        this.setState({item});
    }

    async handleSubmit(event){
        const {item} = this.state;
        await fetch(`/api/expenses/`, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(item)
        });
        event.preventDefault();
        this.props.history.push("/expenses");
    }


    async remove(id){
        await fetch(`/api/expenses/${id}` , {
            method : 'DELETE',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            }
        }).then(() => {
            let updatedExpenses = [...this.state.expenses].filter(i => i.id !== id);
            this.setState({expenses : updatedExpenses});
        });
    }

    async componentDidMount(){
        const response = await fetch(`/api/categories`);
        const body = await response.json();
        this.setState({categories : body});

        const responseExp = await fetch(`/api/expenses`);
        const bodyExp = await responseExp.json();
        this.setState({expenses : bodyExp, isLoading : false});
    }

    render() { 
        const title=<h3>Add Expense</h3>
        const {categories} = this.state;
        const {expenses, isLoading} = this.state;

        if(isLoading)
            return(<div>Loading...</div>);

        let optionList = categories.map(category =>
                          <option value={category.id} key={category.id}>
                            {category.name}
                          </option>    
                        )

        let row = expenses.map(expense =>
                   <tr key={expense.id}>
                       <td>{expense.descript}</td>
                       <td>{expense.location}</td>
                       <td><Moment date={expense.expenseDate} format="DD/MM/YYYY" /></td>
                       <td>{expense.category.name}</td>
                       <td><Button size="sm" color="danger" onClick={() => this.remove(expense.id)}>Delete</Button></td>
                   </tr>
                  )

        return ( 
        <div>
            <AppNav />
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="descript" name="descript" id="descript" onChange={this.handleChange} 
                               autoComplete="name" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="category">Category</Label>
                        <Input type="select" name="name" id="exampleSelectMulti" onChange={this.handleSelectChange}>
                           {optionList} 
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="expensesDate">Date</Label>
                        <DatePicker selected={this.state.item.expenseDate} onChange={this.handleDateChange} />
                    </FormGroup>
                    <div className="row">
                        <FormGroup className="col-md-4 mb-3">
                        <Label for="location">Location</Label>
                        <Input type="text" name="location" id="location" onChange={this.handleChange}/>
                        </FormGroup>  
                    </div>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>



            <Container>
                <h3>Expense List</h3>
                <Table>
                    <thead>
                        <tr>
                            <th width="20%">Description</th>
                            <th width="10%">Location</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th width="10%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </Table>
            </Container>

        </div> 
        );
    }
}
 
export default Expenses;