import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit, Settings } from "lucide-react";

const DEFAULT_URL =
  "https://calendar.google.com/calendar/embed?wkst=2&ctz=Europe%2FIstanbul&showPrint=0&showTz=0&showCalendars=0&showTabs=0&mode=AGENDA&src=tr.turkish%23holiday%40group.v.calendar.google.com&color=%23039be5";

function ensureSimpleAgendaUrl(url) {
  if (!url) return DEFAULT_URL;
  const u = new URL(url, window.location.origin);
  u.searchParams.set("showPrint", "0");
  u.searchParams.set("showTz", "0");
  u.searchParams.set("showCalendars", "0");
  u.searchParams.set("showTabs", "0");
  u.searchParams.set("mode", "AGENDA");
  return u.toString();
}

const CalendarWidget = () => {
  const [calendarUrl, setCalendarUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedUrl = localStorage.getItem("calendarUrl");
    if (savedUrl) {
      setCalendarUrl(savedUrl);
      setInputValue(savedUrl);
    } else {
      setEditing(true);
      setInputValue("");
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCalendarUrl(inputValue.trim());
      localStorage.setItem("calendarUrl", inputValue.trim());
      setEditing(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleReset = () => {
    setCalendarUrl("");
    setInputValue("");
    localStorage.removeItem("calendarUrl");
    setEditing(true);
  };

  const embedUrl = ensureSimpleAgendaUrl(calendarUrl || DEFAULT_URL);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="glass-effect rounded-2xl p-6 h-fit"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-500 bg-opacity-20 rounded-lg">
          <Calendar className="text-primary-400" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Takvim</h2>
        {calendarUrl && !editing && (
          <button
            onClick={handleEdit}
            className="ml-auto text-gray-400 hover:text-primary-400 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            title="Takvim URL'sini değiştir"
          >
            <Settings size={18} />
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <label className="block text-gray-300 text-sm mb-2">
            Google Takvim embed URL'nizi girin:
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="https://calendar.google.com/calendar/embed?..."
            className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-50 text-white border border-gray-600 input-focus"
            required
          />
          <div className="flex gap-2 flex-wrap">
            <button type="submit" className="button-primary">
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                if (calendarUrl) setInputValue(calendarUrl);
              }}
              className="button-secondary"
            >
              İptal
            </button>
            {calendarUrl && (
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg ml-auto"
              >
                Sıfırla
              </button>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-3 p-3 bg-gray-800 bg-opacity-30 rounded-lg">
            <span>
              <b>Not:</b> Google Takvim'den "Takvimi paylaş" &rarr; "Embed code"
              kısmındaki src URL'sini kopyalayın.
              <br />
              Daha sade bir görünüm için URL'nizde <code>mode=AGENDA</code>{" "}
              parametresi olmalı. Otomatik olarak eklenir.
            </span>
          </div>
        </form>
      ) : (
        <>
          <div className="relative aspect-[3/2] min-h-[250px] md:min-h-[350px] w-full rounded-xl overflow-hidden border border-white border-opacity-10">
            <iframe
              src={embedUrl}
              style={{ border: 0 }}
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
              allowFullScreen
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Bugünün planlarını kontrol et ve organize ol! 📅
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CalendarWidget;
