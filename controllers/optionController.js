const Question = require('../models/question');
const Option = require('../models/option')

// to create option
module.exports.create = async function(req,res)
{
    // storing question id
    const questionID =  req.query.id;
    try {

        // finding the question
        const question = await Question.findOne({
            QID : questionID
        })
        // if question exist
        if(question)
        {
            // if the req contain single option then we are converting tht into an array explicitly else 
            // it will be treated as String.
            // if it has more than 1 options it will already be as a Array obj
            const OPTIONS = typeof(req.body.option) == 'string' ? Array(req.body.option) : req.body.option;
            // getting the number of options question currently have
            let OID = question.options.length;
            //looping through
            for(opt of OPTIONS)
            {
                // creating the obj 
               const option = await Option.create({
                    OID:++OID,
                    title:opt,
                    QID:question._id,
                    votes:0,
                    voteLink: `http://localhost:8000/questions/options/add_vote?id=${questionID}_${OID}`
                    // making dynamic vote link with id of 'questionID_OptionID' format
                })
                // add the option to the question
                question.options.push(option);
                // saving the question
                await question.save();
            }

            // success response
            return res.status(200).json({
                message:'Options added successfully.',
            })

        }else
        {
            // if question does not exist
            return res.status(500).json({
                error:'Cannot find the Question.',
            })
        
        }

    } catch (err) {
        console.log("Error in adding option",err);
        return res.status(500).json({
            error:"Unable to add options. Internal Error",
        })
    }
}

// to delete options
module.exports.delete = async function(req,res)
{
    // getting id in the fomat of - questionId_answerID
    // so spilting it into seperate variables
    let [QID,OID] =  req.query.id.split('_');
    let resOPt;

    // decrementing beacuse we are going to treat that as an index
    try {
        //finding question
        const question = await Question.findOne({QID:QID}).populate('options');
        // if question exist
        if(question)
        {

            for(let opt=0,start=1; opt<question.options.length;opt++)
            {
                if(question.options[opt].OID == OID)
                {
                    resOPt = await Option.findByIdAndDelete(question.options[opt].id);
                    question.options.splice(opt,1);
                    opt--;

                }else
                {
                    await Option.findByIdAndUpdate(question.options[opt].id,{
                        OID: start,
                        voteLink: `http://localhost:8000/questions/options/add_vote?id=${QID}_${start}`
                    })
                    start++;

                }
                // console.log('start',start);

            }
            await question.save();

            return res.status(500).json({
                message:'Option deleted successfully.',
                deletedOption : resOPt,
            })
            
        }else
        {
            // question does not exist
            return res.status(500).json({
                error:'Unable to delete option. Question does not exist'
            })
        }

        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error:'Unable to delete option. Internal Error'
        })
    }
}

// to add vote
module.exports.addVote = async function(req,res)
{
    // same way spliting the id into QID and OID
    let [QID,OID] =  req.query.id.split('_');

    try {
        // finding the question
        const question = await Question.findOne({QID:QID});
        // checking if exist
        if(question)
        {
            // finding the option to be voted 
            // decrementing because using as an index
            const optionToVote = question.options[--OID]._id;
            if(optionToVote)
            {
                
                const currentVotes = await Option.findById(optionToVote)
                // updating the value the incrementing the current no with 1
                await Option.findByIdAndUpdate(optionToVote,{votes:currentVotes.votes+1});
            
                return res.status(500).json({
                    message:'vote added successfully.',
                })

            }else
            { 
                // invalid OID
                return res.status(500).json({
                    error:'Unable to add vote. option not found.'
                })
            }

        }else
        {
            // invalid QID
            return res.status(500).json({
                error:'Unable to add vote. Questoion does not exist'
            })
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error:'Unable to add vote. Internal Error.'
        })
    }
}

  