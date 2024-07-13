const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
    // Here we are not looking for all rhe job
    // We are only looking at the jobs Of Each User [1 user all jobs]
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({
        jobs,
        count: jobs.length,
    })
}

const getJob = async (req, res) => {
// Here im destructuring and removing 2 objects { users( from the auth middleWare ), params( from parameters URL ) }
    const { 
        user: { userId },
        params: { id : jobId } 
    } = req

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })

    if(!job){
        throw new NotFoundError(`No Job with ID : ${jobId} `)
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    // this Id came from the TOKEN we build called the authorization middleWare
    req.body.createdBy = req.user.userId
    // This one is the most creative logic i have seen ;)
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
// Here im destructuring and removing 2 objects { users( from the auth middleWare ), params( from parameters URL ) }
    const { 
        user: { userId },
        params: { id : jobId },
        body: { company, position }
    } = req
    if(!company || !position){
        throw new BadRequestError("Company or Position Fields cannot be empty.")
    }

    const job = await Job.findOneAndUpdate({
        _id: jobId,
        createdBy: userId 
    }, req.body, {
        new: true,
        runValidators: true
    })

    if(!job){
        throw new BadRequestError(`No Job Been updated with this ID : ${jobId} `)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const { 
        user: { userId },
        params: { id : jobId },
    } = req
    
    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })

    if(!job){
        throw new NotFoundError(`No Job with ID : ${jobId} `)
    }
    
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}