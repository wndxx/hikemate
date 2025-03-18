import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HomeDashboard = () => {
  const [mountains, setMountains] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/mountains").then((res) => setMountains(res.data));
    axios.get("http://localhost:8080/api/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:8080/api/transactions").then((res) => setTransactions(res.data));
  }, []);

  const filterDataByMonth = (data, dateField) => {
    if (!selectedMonth) return data;
    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getMonth() + 1 === parseInt(selectedMonth);
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Dashboard Home</h1>
      
      <Select onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(12)].map((_, i) => (
            <SelectItem key={i + 1} value={(i + 1).toString()}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Mountains</h2>
            <ul>
              {filterDataByMonth(mountains, "created_at").map((mountain) => (
                <li key={mountain.id}>{mountain.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Users</h2>
            <ul>
              {filterDataByMonth(users, "created_at").map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Transactions</h2>
            <ul>
              {filterDataByMonth(transactions, "transaction_date").map((transaction) => (
                <li key={transaction.id}>{transaction.details}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeDashboard;
