const getAllJobs = async (req, res) => {
    res.status(200).json({
        ...req.user
    })
}
const getJob = async (req, res) => {
    res.send("Get Single Job")
}
const createJob = async (req, res) => {
    res.send("create Job")
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