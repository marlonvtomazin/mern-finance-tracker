import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // A MONGO_URI já está disponível via dotenv.config() que chamamos no index.js
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ ERRO ao conectar ao MongoDB: ${error.message}`);
        // Encerra o processo em caso de falha na conexão
        process.exit(1); 
    }
};

export default connectDB;