// src/api/mockApi.js

// Data mock berdasarkan db.json Anda
const mockData = {
    users: [
        {
            "id": "1",
            "username": "hiker",
            "email": "hiker@example.com",
            "password": "$2b$10$U7E0/YBgZifgveX9XARQk.yDs/hXNYF8tNge4C7rAaC7TxkifBQoO"
          },
          {
            "id": "2",
            "username": "hiker2",
            "email": "hiker123@gmail.com",
            "password": "$2b$10$S9VeOETQdWAFtzvzULolNe9Q.MFxXj2.YTrvlvwe4SreFbiFjvKA6",
            "phone": "123"
          },
          {
            "id": "4",
            "username": "david",
            "email": "david@gmail.com",
            "password": "$2b$10$ucvwIAV63u4/WMb5R.WWwOSXtGicvrWIf7fRrwKXjFMdZsg9UBTFa"
          },
          {
            "id": "5",
            "username": "billy",
            "email": "billi@gmail.com",
            "password": "$2b$10$DNvNT1U4awX/VcUukBchUeHd30RtgHOiK.RFdq0cbMtAt3lOI4y3m"
          },
          {
            "id": "6",
            "username": "ezra",
            "email": "ezra@gmail.com",
            "password": "$2b$10$Hh1xvx.3wE2PAdI05NI6aeADcqcoQniGruX/waDZcbiFBECDLd6Zi"
          },
          {
            "id": "c5b1",
            "username": "acep",
            "email": "acep@gmail.com",
            "role": "admin",
            "password": "$2b$10$bB4Yje/8HJl.YYy.zzrNMe9R/p9YjqJlFICTshaDXWinN/GtAKO6O"
          },
          {
            "id": "c677",
            "username": "windi",
            "email": "saputra@gmail.com",
            "phone": "098876650000",
            "password": "$2b$10$HZZSk6RyHlLoWo6nLfbzQeZgu9pXePcxLQstFsYVTwVmuBD8DTR3i"
          },
          {
            "id": "1487",
            "username": "user123",
            "email": "oren@gmail.com",
            "phone": "093838383833",
            "password": "$2b$10$aa9TOkeo5zFxH8CDdsIswOxx8kPoAEaVXTL.dnq0ou9XCA29rtBb6"
          }
    ],
    mountains: [
        {
            "id": "1",
            "name": "Mount Everest",
            "image": "https://images.unsplash.com/photo-1575728252059-db43d03fc2de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW91bnRhaW4lMjBwZWFrfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            "location": "Nepal/Tibet",
            "elevation": 8848,
            "difficulty": "Extreme",
            "price": 12000,
            "description": "The highest mountain on Earth, located in the Mahalangur Himal sub-range of the Himalayas.",
            "created_at": "2025-03-17T10:00:00Z"
          },
          {
            "id": "2",
            "name": "K2",
            "image": "https://images.unsplash.com/photo-1623966849439-9b16e9bf8c2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8azIlMjBtb3VudGFpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
            "location": "Pakistan/China",
            "elevation": 8611,
            "difficulty": "Extreme",
            "price": 15000,
            "description": "The second-highest mountain on Earth, known for its extreme difficulty and danger.",
            "created_at": "2025-03-17T10:00:00Z"
          },
          {
            "id": "3",
            "name": "Mount Kilimanjaro",
            "image": "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnQlMjBraWxpbWFuamFyb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
            "location": "Tanzania",
            "elevation": 5895,
            "difficulty": "Moderate",
            "price": 4000,
            "description": "The highest mountain in Africa and the highest single free-standing mountain in the world.",
            "created_at": "2025-03-17T10:00:00Z"
          },
          {
            "id": "4",
            "name": "Matterhorn",
            "image": "https://images.unsplash.com/photo-1565108160850-4a8669f98b8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWF0dGVyaG9ybnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
            "location": "Switzerland/Italy",
            "elevation": 4478,
            "difficulty": "Hard",
            "price": 6000,
            "description": "One of the most famous mountains in the Alps, known for its distinctive pyramid shape.",
            "created_at": "2025-03-17T10:00:00Z"
          },
          {
            "id": "5",
            "name": "Mount Fuji",
            "image": "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnQlMjBmdWppfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            "location": "Japan",
            "elevation": 3776,
            "difficulty": "Moderate",
            "price": 2500,
            "description": "The highest mountain in Japan and an active volcano, known for its perfectly symmetrical cone.",
            "created_at": "2025-03-17T10:00:00Z"
          },
          {
            "id": "6",
            "name": "Denali",
            "image": "https://images.unsplash.com/photo-1535581652167-3a26c90a9910?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVuYWxpfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            "location": "Alaska, USA",
            "elevation": 6190,
            "difficulty": "Hard",
            "price": 8000,
            "description": "The highest mountain peak in North America, located in Alaska's Denali National Park.",
            "created_at": "2025-03-17T10:00:00Z"
          }
    ],
    transactions: [
        {
            "id": "1",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "2",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "pending",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "3",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "4",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "5",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "6",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "7",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "8",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "9",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "10",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "11",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          },
          {
            "id": "12",
            "hiker_id": "daef",
            "total_amount": 100000,
            "transaction_date": "2025-03-17T11:00:00Z",
            "status": "completed",
            "created_at": "2025-03-17T11:00:00Z"
          }
    ]
  };
  
  // Simulasi delay API
  const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock API Functions
  export const mockApi = {
    // Auth
    async login(email, password) {
      await simulateDelay();
      const user = mockData.users.find(u => u.email === email);
      
      if (!user) {
        throw { response: { status: 404, data: { message: 'User not found' } } };
      }
  
      // NOTE: Dalam real app, password harus diverifikasi dengan hash
      return { 
        data: {
          token: 'mock-jwt-token',
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          }
        }
      };
    },
  
    // Mountains
    async getMountains() {
      await simulateDelay();
      return { data: mockData.mountains };
    },
  
    async getMountainById(id) {
      await simulateDelay();
      const mountain = mockData.mountains.find(m => m.id === id);
      return { data: mountain };
    },
  
    // Transactions
    async getTransactions() {
      await simulateDelay();
      return { data: mockData.transactions };
    },
  
    async createTransaction(data) {
      await simulateDelay();
      const newTransaction = {
        id: `t${mockData.transactions.length + 1}`,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      mockData.transactions.push(newTransaction);
      return { data: newTransaction };
    }
  };
  
  // Gunakan ini untuk menggantikan axiosInstance di komponen
  export default mockApi;