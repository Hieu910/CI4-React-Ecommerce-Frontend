import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppDispatch";

const Footer = () => {
  const { categories } = useAppSelector((state) => state.category);
  return (
    <footer className="bg-card mt-12 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">STYLISH</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Cart", path: "/cart" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h4 className="font-medium text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => {
                return (
                  <li key={category.id}>
                    <Link
                      to={`/products?category=${category.id}`}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>


          <div>
            <h4 className="font-medium text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: nguyendinhhieuit@gmail.com</li>
              <li>Phone: 0123456789</li>
              <li>Address: Lorem ipsum dolor sit amet</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 STYLISH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
