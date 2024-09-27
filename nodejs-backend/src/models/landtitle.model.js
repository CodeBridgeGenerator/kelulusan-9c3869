
    module.exports = function (app) {
        const modelName = 'landtitle';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            titleId: { type: Number, required: false, min: 0, max: 1000000 },
titleNumber: { type: Number, required: false, min: 0, max: 17542906 },
ownerId: { type: Schema.Types.ObjectId, ref: "titleowner" },
registeredDate: { type: Number, required: false, min: 0, max: 10000000 },
expireDate: { type: Number, required: false, min: 0, max: 10000000 },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };