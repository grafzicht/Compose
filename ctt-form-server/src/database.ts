import {Collection, Db, MongoClient, ObjectId} from 'mongodb'

const client = new MongoClient('mongodb://grafzicht.nl:27017', {
	useUnifiedTopology: true
});
let collection: Collection;

export const connect = () => client.connect()
	.then(client => collection = client.db('ctt').collection('documents'));

export const listDocuments = () => collection.find().toArray();
export const getDocument = (id: string) => collection.findOne({_id: new ObjectId(id)});
export const addDocument = (document: object) => collection.insertOne(document);
export const updateDocument = (id: string, update: object) => collection.updateOne({_id: new ObjectId(id)}, {$set: update}, {upsert: true});
export const removeDocument = (id: string) => {
	collection.deleteOne({_id: id});
	return collection.deleteOne({_id: new ObjectId(id)});
}
