import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Heading from "../components/Heading";

const localizer = momentLocalizer(moment);

// Rename the component from Calendar to CalendarPage
// eslint-disable-next-line react/prop-types
const CalendarPage = ({ title = "Calendar", track = "Manage" }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: moment().toDate(),
    end: moment().toDate(),
    description: "",
  });

  // Load events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Handle slot selection (clicking on calendar dates)
  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      start,
      end,
      description: "",
    });
    setShowModal(true);
  };

  // Add new event
  const handleAddEvent = async () => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        await fetchEvents();
        setShowModal(false);
        // Send notification to admin
        sendNotification("New event has been added");
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Update event
  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedEvent),
      });

      if (response.ok) {
        await fetchEvents();
        setShowModal(false);
        sendNotification("Event has been updated");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchEvents();
        setShowModal(false);
        sendNotification("Event has been deleted");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Send notification to admin
  const sendNotification = async (message) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <div className="flex justify-between items-center mb-4 px-4">
        <div>
          <Button onClick={goToBack} variant="outline-primary" className="mr-2">
            Back
          </Button>
          <Button onClick={goToNext} variant="outline-primary" className="mr-2">
            Next
          </Button>
          <Button onClick={goToCurrent} variant="outline-primary">
            Today
          </Button>
        </div>
        <h3 className="font-semibold">{toolbar.label}</h3>
        <div>
          <Button
            onClick={() => toolbar.onView("month")}
            variant={toolbar.view === "month" ? "primary" : "outline-primary"}
            className="mr-2"
          >
            Month
          </Button>
          <Button
            onClick={() => toolbar.onView("week")}
            variant={toolbar.view === "week" ? "primary" : "outline-primary"}
            className="mr-2"
          >
            Week
          </Button>
          <Button
            onClick={() => toolbar.onView("day")}
            variant={toolbar.view === "day" ? "primary" : "outline-primary"}
          >
            Day
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-full w-full bg-white dark:bg-gray-800 my-5">
        <div className="p-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setShowModal(true);
            }}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            components={{
              toolbar: CustomToolbar,
            }}
            views={["month", "week", "day"]}
            popup
            className="rounded-lg shadow-sm"
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-black dark:text-white text-2xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
              {selectedEvent ? "Update Event" : "Create Event"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                selectedEvent ? handleUpdateEvent() : handleAddEvent();
              }}
            >
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedEvent ? selectedEvent.title : newEvent.title}
                  onChange={(e) => {
                    if (selectedEvent) {
                      setSelectedEvent({
                        ...selectedEvent,
                        title: e.target.value,
                      });
                    } else {
                      setNewEvent({ ...newEvent, title: e.target.value });
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={moment(
                    selectedEvent ? selectedEvent.start : newEvent.start
                  ).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) => {
                    const date = moment(e.target.value).toDate();
                    if (selectedEvent) {
                      setSelectedEvent({ ...selectedEvent, start: date });
                    } else {
                      setNewEvent({ ...newEvent, start: date });
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={moment(
                    selectedEvent ? selectedEvent.end : newEvent.end
                  ).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) => {
                    const date = moment(e.target.value).toDate();
                    if (selectedEvent) {
                      setSelectedEvent({ ...selectedEvent, end: date });
                    } else {
                      setNewEvent({ ...newEvent, end: date });
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={
                    selectedEvent
                      ? selectedEvent.description
                      : newEvent.description
                  }
                  onChange={(e) => {
                    if (selectedEvent) {
                      setSelectedEvent({
                        ...selectedEvent,
                        description: e.target.value,
                      });
                    } else {
                      setNewEvent({ ...newEvent, description: e.target.value });
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="flex gap-2">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  {selectedEvent ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
