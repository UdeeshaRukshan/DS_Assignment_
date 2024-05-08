"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import "../../../index.css";
import { use } from "react";
export function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState("");
  const [replyMessage, setReplyMessage] = useState(""); // State for managing reply message
  const [selectedTicket, setSelectedTicket] = useState();
  const [replyFormData, setReplyFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    reply: "",
  });

  const handleReplyChange = (e) => {
    setReplyFormData({ ...replyFormData, [e.target.name]: e.target.value });
  };
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

  console.log(selectedTicket);
  const handleRemove = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8074/api/tickets/${ticketId}`);
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      console.log("Ticket deleted:", ticketId);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleReply = (ticket) => {
    setReplyToEmail(ticket.email);
    setIsReplyModalOpen(true);
    setSelectedTicket(ticket);
  };

  console.log(selectedTicket);

  const handleResolve = async (ticketId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8074/api/tickets/${ticketId}/resolve`
      );
      console.log("Ticket resolved:", response.data);

      // Update local state to reflect the resolved status
      const updatedTickets = tickets.map((ticket) => {
        if (ticket._id === ticketId) {
          return { ...ticket, state: "resolved" };
        }
        return ticket;
      });
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Error resolving ticket:", error);
    }
  };
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    // Assuming your API expects ticket ID and reply details
    const replyData = {
      message: replyFormData.reply,
      repliedBy: "Admin Name", // This should ideally come from session or auth context
    };

    try {
      // Replace 'http://your-api-endpoint/replies' with actual URL and include the ticket ID
      const response = await axios.post(
        `http://localhost:8074/api/tickets/${selectedTicket._id}/replies`,
        replyData
      );
      console.log("Reply sent:", response.data);
      setIsReplyModalOpen(false); // Close modal after submission
      setReplyFormData({ ...replyFormData, reply: "" }); // Reset reply in form data

      // Update the ticket list with new reply without reloading
      const updatedTickets = tickets.map((ticket) => {
        if (ticket._id === selectedTicket._id) {
          return { ...ticket, replies: [...ticket.replies, response.data] };
        }
        return ticket;
      });
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
    <div className="flex justify-center mt-4 mb-2">
    <h1 className="text-3xl font-semibold text-gray-800 leading-tight">
        Support Ticket Dashboard
    </h1>
</div>
      {isReplyModalOpen ? (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Reply to Ticket
              </h3>
              <button
                type="button"
                onClick={() => setIsReplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleReplySubmit} className="mt-2 space-y-6">
              <input
                type="text"
                name="name"
                value={selectedTicket.name}
                onChange={handleReplyChange}
                required
                placeholder="Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="email"
                name="email"
                value={selectedTicket.email}
                onChange={handleReplyChange}
                required
                placeholder="Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                name="category"
                value={selectedTicket.category}
                onChange={handleReplyChange}
                required
                placeholder="Category"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                name="subject"
                value={selectedTicket.subject}
                onChange={handleReplyChange}
                required
                placeholder="Subject"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <textarea
                name="message"
                value={selectedTicket.message}
                onChange={handleReplyChange}
                required
                placeholder="Message"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <textarea
                name="reply"
                value={selectedTicket.reply}
                onChange={handleReplyChange}
                required
                placeholder="Reply message"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Reply
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="tableStyle flex items-center justify-center h-screen">
          <div className=" max-w-4xl relative shadow-md sm:rounded-lg">
            <Table
              striped
              hoverable={true}
              className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Subject</Table.HeadCell>
                <Table.HeadCell>Message</Table.HeadCell>
                <Table.HeadCell>Reply</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
                
              </Table.Head>
              <Table.Body className="divide-y">
                {tickets.map((ticket, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <Table.Cell className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {ticket.name}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white whitespace-normal">
                      {ticket.email}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white whitespace-normal">
                      {ticket.category}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white whitespace-normal">
                      {ticket.subject}
                    </Table.Cell>
                    <Table.Cell className="message-column px-6 py-4 min-h-[100px] font-medium text-gray-900 dark:text-white whitespace-normal">
                      {ticket.message}
                    </Table.Cell>
                    <Table.Cell className="message-column px-6 py-4 min-h-[100px] font-medium text-gray-900 dark:text-white whitespace-normal">
                    {ticket.replies[0]?.message}
                    </Table.Cell>
                    <Table.Cell className="message-column px-6 py-4 min-h-[100px] font-medium text-gray-900 dark:text-white whitespace-normal">
                      {ticket.state}
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex">
                        <button
                          onClick={() => handleReply(ticket)}
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleRemove(ticket._id)}
                          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleResolve(ticket._id)
                          }
                          disabled={ticket.state === 'resolved'}
                          className={`focus:outline-none text-white ${ticket.state === 'resolved' ? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'} focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
                        >
                          Resolve
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
