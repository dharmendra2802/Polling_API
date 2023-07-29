# Polling_API
An API where anyone can ADD, DELETE, and VOTE questions
# Introduction
We can make various API requests to - <br> 
1 - Add a question <br>
2 - Add an option <br>
3 - Delete an option <br>
4 - Delete a question <br>
5 - Add vote to options <br>

# End Points
### 1 - To add a question - http://localhost:8000/questions/create
        we will send the question along with the question id through which we will identify the question for future ref
### 2 - To add an option - http://localhost:8000/questions/options/create?id=#
        we will send the id through param
### 3 - To view a question along with its options - http://localhost:8000/questions/?id=#
        we will send the id through param
        each option will else have a unique link to add a vote to that option
### 4 - To delete a question - http://localhost:8000/questions/delete?id=#
        we will send the id through param
        if the option of question contains a vote then we have add ' force=true' in the params as well 
        http://localhost:8000/questions/delete?id=12&force=true
### 5 - To delete an option - http://localhost:8000/questions/options/delete?id=#_#
        ** ID format - questionID_optionID **
        we will send the id through param
        if the option contains a vote then we have add ' force=true' in the params as well 
        http://localhost:8000/questions/options/delete?id=#_#&force=true    
### 6 - To add a vote to the option - http://localhost:8000/questions/options/add_vote?id=#_#
       **id format - questionID_optionID**
       For example - if we want to delete the 2nd option from the question having QID 16 then
       http://localhost:8000/questions/options/add_vote?id=16_2

## Responses 
    The response will give a simple message stating whether the operation was successful or not

## Installation
    1 - Fork the project
    2 - Run - npm init (it will install all the required library
    3 - Then you can start sending request to the API

### END ###
