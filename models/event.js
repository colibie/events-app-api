module.exports = (Schema) => {
  const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // form 1
    location: { type: String },
    "event-title": { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String },
    "birth-month": { type: String },
    "birth-day": { type: String },
    "birth-year": { type: String },

    // form 2
    "education-language": { type: String },
    "education-to-year": { type: String },
    "education-to-month": { type: String },
    "education-from-year": { type: String },
    "education-from-month": { type: String },
    "specialization": { type: String },
    "degree-level": { type: String },
    "university-country": { type: String },
    "university": { type: String },

    // form 3
    "experience-description": { type: String },
    "experience-to-year": { type: String },
    "experience-to-month": { type: String },
    "experience-from-year": { type: String },
    "experience-from-month": { type: String },
    "experience-position": { type: String },
    "experience-company": { type: String },

    // form 4
    "source": { type: String },
    "availability": { type: String },
    "additional-info": { type: String },

  }, { timestamps: true });

  return schema;
};