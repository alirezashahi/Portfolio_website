import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const skills = [
  { name: "Python", icon: "🐍" },
  { name: "SQL", icon: "🗃️" },
  { name: "Machine Learning", icon: "🤖" },
  { name: "Data Analysis", icon: "📊" },
  { name: "Business Intelligence", icon: "💼" },
];

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-sky-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0ibTM2IDM0djEwaDE0di0xMHptMC0ydjEyaDE0di0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 leading-tight">
                Alireza Shahi
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
              <p className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
                Data Analytics & Digital Transformation
              </p>
            </div>
            
            <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Detail-oriented Master's student (Digital Transformation Management, UniBo) 
              skilled in Python, SQL, and Machine Learning. Passionate about using 
              data-driven insights for strategic decisions. Seeking an internship.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Link to="/projects">View Projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Link to="/about">About Me</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Link to="/contact">Contact Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Key Skills</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Leveraging cutting-edge technologies to transform data into actionable insights
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {skills.map((skill, index) => (
                <div 
                  key={skill.name} 
                  className="group bg-white border-2 border-gray-100 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-200 aspect-square flex flex-col items-center justify-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
                  <p className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Collaborate?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Let's connect and discuss how my data analytics expertise can drive your business forward
          </p>
          <Button asChild className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <Link to="/contact">
              <span role="img" aria-label="email icon" className="mr-3 text-2xl">✉️</span>
              Get in Touch
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomePage; 