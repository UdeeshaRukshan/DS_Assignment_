"use client";
import axios from "axios";
import { useState,useEffect } from "react";
import { Table } from "flowbite-react";
import "../../../index.css";
import { use } from "react";
export function MyTickets() {
  const [tickets,setTickets] = useState([]); // Add this line 

useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8074/api/tickets");
        setTickets(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTickets();
  }, []);

  const handleRemove = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8074/api/tickets/${ticketId}`);
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
      console.log("Ticket deleted:", ticketId);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleReply = (email) => {
    console.log(`Reply to: ${email}`);
    // Implement reply functionality here
  };


  const handleResolve = (email) => {
    console.log(email);
  
    // Implement resolve functionality here
  };

  return (
    <div className="tableStyle flex items-center justify-center h-screen">
      <div className="w-full max-w-4xl relative shadow-md sm:rounded-lg">
        <Table striped hoverable={true} className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Subject</Table.HeadCell>
            <Table.HeadCell >Message</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tickets.map((ticket, index) => (
              <Table.Row key={index} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                <Table.Cell className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {ticket.name}
                </Table.Cell>
                <Table.Cell className="font-medium text-gray-900 dark:text-white whitespace-normal">{ticket.email}</Table.Cell>
                <Table.Cell className="font-medium text-gray-900 dark:text-white whitespace-normal">{ticket.category}</Table.Cell>
                <Table.Cell className="font-medium text-gray-900 dark:text-white whitespace-normal">{ticket.subject}</Table.Cell>
                <Table.Cell className="message-column px-6 py-4 min-h-[100px] font-medium text-gray-900 dark:text-white whitespace-normal">
  {ticket.message}
</Table.Cell>

                <Table.Cell>
                  <div className="flex">
                  <button onClick={() => handleReply("Hello this is reply")} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Reply</button>
                  <button onClick={() => handleRemove(ticket._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Reject</button>
                  <button onClick={() => handleResolve("Hello this is resp;ved")} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Resolve</button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
