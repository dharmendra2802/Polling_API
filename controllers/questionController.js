// importing models
const Question = require('../models/question');
const Option = require('../models/option');

// to create a question
module.exports.create = async function(req,res)
{
    // storing the data from the req
    const question = req.body;

    // storing Queston id into QID from req body
    let QID = req.body.QID;
    try {
        // creating the question obj in our database
        const newQuestion = await Question.create({
            QID:QID,
            title:question.title,
        })

        // returning successfull response
        return res.status(200).json({
            message:'Question added successfully.',
        })

    } catch (err) {
        // catching error

        console.log("Error in adding question.",err);

        return res.status(500).json({
            error:"Unable to add question.",
        })
    }
}

// to display the question
module.exports.display = async function(req,res)
{
    // getting QID
    const QID = req.query.id;

    try {
        // finding the required question from the Question model
        // then populating the options inside that object
        const question = await Question.findOne({QID:QID}).populate('options').exec();

        //  if question exist
        if(question)
        {
            return res.status(200).json({
                question:question
            })

        }else
        {   
            // if question does not exist   
            return res.status(500).json({
                error:"Question not found."
            })
        }

    } catch (err) {
        // if some error came with the mongo while finding so catch 
        console.log(err);
        return res.status(500).json({
            error:"Unable to display Question.",
        })
    }
}


// to de;lete the question

module.exports.delete = async function(req,res)
{
    // getting QID
    const QID = req.query.id;

    try {
        // finding required question
        const question = await Question.findOne({QID:QID})
        const resQues = question
        // if question exist
        if(question)
        {
            // storing array of options - it will contain the _id of Option objects
            const option = question.options;

            // to verify whether need to delete or not
            let toDelete = true;

            // reason we are also deleting the option from database
            // cause if their qquestion does not exist then it make no sense to fill the
            // save with garbage options

            // looping through the options array
            for(opt of option)
            {
                // if it was a force req to delete then we will delete the option and question
                // irrespect of their votes
                if(req.query.force)
                {
                    // finding and deleting
                    await Option.findByIdAndDelete(opt._id);

                }else
                {
                    // in case it was a normal req then we will ensure each options 
                    // has 0 votes
                    
                    const currOPt = await Option.findById(opt._id);
                    
                    // if current option has 0 votes then continue
                    if(!currOPt || currOPt.votes == 0)
                        toDelete = true;
                    else
                    {
                        // if the option has even a single vote
                        // we will set toDelete to false and break loop
                        toDelete = false;
                        break;
                    }
                }
                
            }
            // if toDelete is true
            // it means we can delete
            if(toDelete)
            {
                // req.query.force is true mean we already deleted the options so need to run this if
                // if it false and then it means it was a normal req but the all the options has 0 votes
                // so we will use ! and run the if
                if(!req.query.force)
                {
                    // again looping through the option array and deleting them
                    for(opt of option)
                        await Option.findByIdAndDelete(opt._id);
                }
                // finally delete the question
                await question.deleteOne();
            
                // returning success response
                return res.status(200).json({
                    message:"Question deleted successfully.",
                    deletedQuestion: resQues,
                })
            }
            else
            {
                // incase the req was normal but options has votes
                return res.status(500).json({
                    error:`Cannot Delete, Options have votes.`,
                    solution : `Add 'force=true' param in req to delete forcefully.`
                })
            }

        }else
        {   // in case the mention question does not exist
            return res.status(500).json({
                error:"Unable to delete. Question not found."
            })
        }
        
    } catch (err) {
        console.log(err);
        // normal error handling 
        return res.status(500).json({
            error:"Unable to delete. Internal Error."
        })
    }

}