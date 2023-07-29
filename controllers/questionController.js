const Question = require('../models/question');
const Option = require('../models/option');
const { response } = require('express');

// let QID = 0;

module.exports.create = async function(req,res)
{
    const question = req.body;
    console.log(question);
    let MSG = 'Question Added successfully';
    let QID = req.body.QID;
    try {

        const newQuestion = await Question.create({
            QID:QID,
            title:question.title,
        })

        return res.status(200).json({
            message:'Question Added',
            questionData : newQuestion,
        })

    } catch (err) {
        console.log("Error in adding question",err);
        return res.status(500).json({
            message:"Unable to add question",
        })
    }
}

module.exports.display = async function(req,res)
{
    const QID = req.query.id;
    console.log(QID)
    try {
        const question = await Question.findOne({QID:QID}).populate('options').exec();
        console.log(question)

        if(question)
        {
            
            return res.status(200).json({
                question:question
            })

        }else
        {
            return res.status(500).json({
                message:"Question not found"
            })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message:"Unable to display Question",
        })
    }
}


module.exports.delete = async function(req,res)
{

    const QID = req.query.id;
    console.log(QID)
    try {

        const question = await Question.findOne({QID:QID})

        if(question)
        {
            const option = await Option.find({QID:question._id});
            let toDelete = true;

            for(opt of option)
            {
                if(req.query.force)
                {
                    await Option.findByIdAndDelete(opt.id);

                }else
                {
                    const currOPt = await Option.findById(opt.id);
    
                    if(currOPt.votes == 0)
                        toDelete = true;
                    else
                    {
                        toDelete = false;
                        break;
                    }
                }
                
            }
            if(toDelete)
            {
                if(!req.query.force)
                {
                    for(opt of option)
                        await Option.findByIdAndDelete(opt.id);
                }

                await question.deleteOne();
    
                return res.status(200).json({
                    message:"Question deleted.",
                })
            }
            else
            {
                return res.status(500).json({
                    error:`Cannot Delete , this question's options has Votes`,
                    solution : `Add 'force=true' param in req to delete forcefully`
                })
            }

        }else
        {
            return res.status(500).json({
                message:"Unable to delete. Question not found"
            })
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message:"Unable to delete. Internal Error"
        })
    }

}