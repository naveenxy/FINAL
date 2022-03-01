const fileDao=require('../Dao/fileDao')
const {decrypttext}=require('../middlewares/crypto')

const paginatedResults=() =>{
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await fileDao.countDocuments()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await fileDao.getUser(limit,startIndex)
       res.paginatedResults = results
        next()
      } catch (e) {
        res.json({ message:"error" })
      }
    }
  }

  module.exports=paginatedResults