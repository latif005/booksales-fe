
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setNotification("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim pesan.");
      }

      setNotification("Pesan berhasil dikirim kepada Admin!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setNotification(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-md px-4">

        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">
            Contact Admin
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Punya pertanyaan atau membutuhkan bantuan?
            Silakan kirimkan pesan kepada kami.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Subjek
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Masukkan subjek pesan"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Pesan
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Tuliskan pesan kamu..."
            />
          </div>

          {notification && (
            <p className="text-sm font-medium text-indigo-600">
              {notification}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </div>
    </section>
  );
}
