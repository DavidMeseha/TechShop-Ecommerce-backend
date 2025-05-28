import mongoose from 'mongoose';
import { VendorSchema } from '@/models/Vendors';
import { CategorySchema } from '@/models/Categories';
import { UserSchema } from '@/models/Users';
import { ProductReviewSchema } from '@/models/Reviews';
import { TagSchema } from '@/models/Tags';
import { CountrySchema } from '@/models/Countries';
import { CitySchema } from '@/models/Cities';
import { OrderSchema } from '@/models/Orders';
import { DB_URI } from './env.config';

export default async function initializeDatabase() {
  try {
    await mongoose.connect(DB_URI ?? '');
    console.log('Database connected');

    // Initialize models
    mongoose.model('Vendors', VendorSchema);
    mongoose.model('Categories', CategorySchema);
    mongoose.model('Users', UserSchema);
    mongoose.model('Reviews', ProductReviewSchema);
    mongoose.model('Tags', TagSchema);
    mongoose.model('Countries', CountrySchema);
    mongoose.model('Cities', CitySchema);
    mongoose.model('Orders', OrderSchema);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}
