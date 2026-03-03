export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Educaption</h3>
            <p className="text-sm text-slate-300">
              Helping Tamil Nadu students find their path to higher education.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li><a href="/calculator" className="hover:text-white">Calculator</a></li>
              <li><a href="/courses" className="hover:text-white">Courses</a></li>
              <li><a href="/colleges" className="hover:text-white">Colleges</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-sm text-slate-300">
              Email: info@educaption.org<br />
              Phone: +91 9xxx xxxx xx
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-4 text-center text-sm text-slate-300">
          &copy; 2026 Educaption. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
