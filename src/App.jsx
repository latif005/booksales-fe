import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Home from "./pages/public";
import PublicLayout from "./layouts/public";
import Books from "./pages/public/books";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin";
import AdminBooks from "./pages/admin/books";
import BookCreate from "./pages/admin/books/create";
import GenresIndex from "./pages/admin/genres";
import GenreCreate from "./pages/admin/genres/create";
import GenreEdit from "./pages/admin/genres/edit";
import AuthorsIndex from "./pages/admin/authors";
import AuthorCreate from "./pages/admin/authors/create";
import AuthorEdit from "./pages/admin/authors/edit";
import BookEdit from "./pages/admin/books/edit";
import ShowBook from "./pages/public/books/show";
import TransactionHistory from "./pages/public/transactions/history";
import TransactionDetail from "./pages/public/transactions/detail";
import AdminTransactions from "./pages/admin/transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersIndex from "./pages/admin/users";
import About from "./pages/public/about";
import Contact from "./pages/public/contact";
import ContactMessages from "./pages/admin/contact-messages";
import Cart from "./pages/public/cart";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route index element={<About />} />

            <Route path="books">
              <Route index element={<Books />} />
              <Route path="show/:id" element={<ShowBook />} />
            </Route>

            <Route path="cart" element={<Cart />} />

            <Route path="contact" element={<Contact />} />

            <Route
              path="transactions/history"
              element={
                <ProtectedRoute role="customer">
                  <TransactionHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="transactions/detail/:id"
              element={
                <ProtectedRoute role="customer">
                  <TransactionDetail />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Admin */}
          {/* Admin */}
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="books">
              <Route index element={<AdminBooks />} />
              <Route path="create" element={<BookCreate />} />
              <Route path="edit/:id" element={<BookEdit />} />
            </Route>

            {/* Genres */}
            <Route path="genres">
              <Route index element={<GenresIndex />} />
              <Route path="create" element={<GenreCreate />} />
              <Route path="edit/:id" element={<GenreEdit />} />
            </Route>

            {/* Authors */}
            <Route path="authors">
              <Route index element={<AuthorsIndex />} />
              <Route path="create" element={<AuthorCreate />} />
              <Route path="edit/:id" element={<AuthorEdit />} />
            </Route>

            {/* Users */}
            <Route path="users" element={<UsersIndex />} />

            {/* Transactions */}
            <Route path="transactions" element={<AdminTransactions />} />

            <Route path="contact-messages" element={<ContactMessages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
