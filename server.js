// const express = require("express")
// const app = express()
// const cors = require("cors")
// const { MongoClient, ObjectId } = require("mongodb")
// const { urlencoded } = require("express")
// const PORT = 8000
// require("dotenv").config()

// let db,
//   dbConnectionStr = process.env.DB_KEY,
//   dbName = "sample_mflix",
//   collection

// MongoClient.connect(dbConnectionStr).then((client) => {
//   console.log(`Connected to ${dbName} Database`)
//   db = client.db(dbName)
//   collection = db.collection("movies")
// })

// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())
// app.use(cors())

// // this get brings back array of many options
// app.get("/search", async (req, res) => {
//   try {
//     let result = await collection
//       .aggregate([
//         {
//           $search: {
//             autocomplete: {
//               query: `${req.query.query}`,
//               path: "title",
//               fuzzy: {
//                 maxEdits: 2,
//                 prefixLength: 3,
//               },
//             },
//           },
//         },
//       ])
//       .toArray()
//     res.send(result)
//   } catch (error) {
//     res.status(500).send({ message: error.message })
//   }
// })

// app.get("/get/:id", async (req, res) => {
//   try {
//     let result = await collection.findOne({
//       _id: ObjectId(req.params.id),
//     })
//     res.send(result)
//   } catch (error) {
//     res.status(500).send({ message: error.message })
//   }
// })

// //Setup localHost on PORT
// app.listen(process.env.PORT || PORT, () => {
//   console.log(`Server is running on ${PORT}`)
// })

const express = require("express")
const app = express()
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")
const { response } = require("express")
const { request } = require("http")
require("dotenv").config()
const PORT = 8000

let db,
  dbConnectionStr = process.env.DB_KEY,
  dbName = "sample_mflix",
  collection

MongoClient.connect(dbConnectionStr).then((client) => {
  console.log(`Connected to ${dbName} database`)
  db = client.db(dbName)
  collection = db.collection("movies")
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get("/search", async (request, response) => {
  try {
    let result = await collection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${request.query.query}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 3,
              },
            },
          },
        },
      ])
      .toArray()
    //console.log(result)
    response.send(result)
  } catch (error) {
    response.status(500).send({ message: error.message })
    //console.log(error)
  }
})

app.get("/get/:id", async (request, response) => {
  try {
    let result = await collection.findOne({
      _id: ObjectId(request.params.id),
    })
    response.send(result)
  } catch (error) {
    response.status(500).send({ message: error.message })
  }
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running.`)
})
