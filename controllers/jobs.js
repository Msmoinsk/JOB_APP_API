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
    res.send("Get Single Job")
}
const createJob = async (req, res) => {
    // this Id came from the TOKEN we build called the authorization middleWare
    req.body.createdBy = req.user.userId
    // This one is the most creative logic i have seen ;)
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async (req, res) => {
    res.send("Update Job")
}
const deleteJob = async (req, res) => {
    res.send("delete Job")
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}