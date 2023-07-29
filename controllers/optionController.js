const Question = require('../models/question');
const Option = require('../models/option')

module.exports.create = async function(req,res)
{
    const questionID =  req.query.id;

    try {

        const question = await Question.findOne({
            QID : questionID
        })

        if(question)
        {
            
            const OPTIONS = typeof(req.body.option) == 'string' ? Array(req.body.option) : req.body.option;
            let OID = question.options.length;
            for(opt of OPTIONS)
            {
               const option = await Option.create({
                    OID:++OID,
                    title:opt,
                    QID:question._id,
                    votes:0,
                    voteLink: `http://localhost:8000/questions/options/add_vote?id=${questionID}_${OID}`
                })
                question.options.push(option);
                await question.save();
            }
            
            return res.status(200).json({
                message:'Options added successfully',
                question:question
            })

        }else
        {
            return res.status(500).json({
                message:'Cannot find the Question',
            })
        
        }

    } catch (err) {
        console.log("Error in adding option",err);
        return res.status(500).json({
            message:"Unable to add options",
        })
    }
}


module.exports.delete = async function(req,res)
{
    let [QID,OID] =  req.query.id.split('_');
    console.log(QID,OID);
    OID--;
    try {

        const question = await Question.findOne({QID:QID});
        if(question)
        {
            const optionToDelete = question.options[OID]._id;
            if(optionToDelete)
            {
                const currOPT = await Option.findById(optionToDelete);

                if(currOPT.votes==0 || req.query.force)
                {
                    await question.options.pop(OID);
                    await currOPT.deleteOne();
                    question.save();
                }else
                {
                    return res.status(500).json({
                        error:`Cannot Delete , this option has Votes`,
                        solution : `Add 'force=true' param in req to delete forcefully`
                    })   
                }
                
                return res.status(500).json({
                    message:'Option deleted successfully'
                })

            }else
            { 
                return res.status(500).json({
                    message:'Unable to delete option. Option does not exist'
                })
            }

        }else
        {
            return res.status(500).json({
                message:'Unable to delete option. Question does not exist'
            })
        }

        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message:'Unable to delete option. Internal Error'
        })
    }
}

module.exports.addVote = async function(req,res)
{
    let [QID,OID] =  req.query.id.split('_');
    console.log(QID,OID);

    try {

        const question = await Question.findOne({QID:QID});
        if(question)
        {
            const optionToVote = question.options[--OID]._id;
            if(optionToVote)
            {
                const currentVotes = await Option.findById(optionToVote)
                await Option.findByIdAndUpdate(optionToVote,{votes:currentVotes.votes+1});
            
                return res.status(500).json({
                    message:'vote added successfully',
                    question
                })

            }else
            { 
                return res.status(500).json({
                    message:'Unable to add vote. ID not found'
                })
            }

        }else
        {
            return res.status(500).json({
                message:'Unable to add vote. ID does not exist'
            })
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message:'Unable to add vote. Internal Error'
        })
    }
}

