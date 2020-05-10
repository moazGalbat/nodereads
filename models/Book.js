const mongoose = require('mongoose');
const CategoryModel = require('./Category')
// const AuthorModel = require('./Author')

const schema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    photo: { data: Buffer, contentType: String },
    authors: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Author'
        }
    ],
    categories: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    ],
    rates: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rate: {
                type: Number,
                min: 1,
                max: 5,
            }
        }
    ],
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            content: {
                type: String,
                minlength: 3,
                maxlength: 512,
            }
        }
    ],
})

schema.pre('findOneAndDelete', function (next) {
    const book_id = this.getQuery()._id
    const AuthorModel = mongoose.model('Author')
    // const CategoryModel = mongoose.model('Category')

    AuthorModel.find({books: book_id},(err,authors)=>{
        if (err) next(err)
        authors.map(author=>{
            author.books.pull(book_id);
            author.save((err)=>{
                if (err) next(err);
            })
        })
    })
    CategoryModel.find({books: book_id},(err,categories)=>{
        if (err) next(err)
        categories.map(category=>{
            category.books.pull(book_id);
            category.save((err)=>{
                if (err) next(err);
            })
        })
    })
    next()
})
const Book = mongoose.model('Book', schema);
module.exports = Book;
