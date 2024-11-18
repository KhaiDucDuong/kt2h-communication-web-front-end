"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Users,
  Headset,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import { getCurrentUserAndRefreshToken } from "@/services/AuthService";
import { getCurrentUser, getRefreshToken } from "@/services/UserService";
import { User } from "@/types/user";
import Link from "next/link";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const result = await Promise.all([getCurrentUser(), getRefreshToken()]);
      if (result[0] && result[1]) setHasSession(true);
    };

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    checkUserSession();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      setHasSession(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A] py-4 px-6 flex justify-between items-center">
        <div className="text-[#1E90FF] text-2xl font-bold">
          <span className="sr-only">Logo</span>
          <Image
            src="/assets/images/app_logo.png"
            alt="kt2h icon"
            width={50}
            height={50}
            className="size-[32px]"
          />
        </div>
        <Link href={hasSession ? "/dashboard" : "/sign-in"}>
          <Button className="bg-gradient-to-r from-[#1E90FF] to-[#9C27B0] hover:from-[#1E90FF] hover:to-[#7B1FA2] text-white font-bold py-2 px-4 rounded transition-all duration-300 hover:shadow-lg hover:shadow-[#1E90FF]/50">
            {hasSession ? "To Dashboard" : "Sign In"}
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at ${scrollY / 5}px ${
              scrollY / 5
            }px, #1E90FF, #9C27B0)`,
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
          }}
        />
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
            Connect. Collaborate. Communicate.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up animation-delay-300">
            Bringing you closer to the people and conversations that matter.
          </p>
          <div className="space-x-4 animate-fade-in-up animation-delay-600">
            <Button className="bg-gradient-to-r from-[#1E90FF] to-[#9C27B0] hover:from-[#1E90FF] hover:to-[#7B1FA2] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#1E90FF]/50">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#1F1F1F]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: MessageCircle,
              title: "Real-Time Messaging",
              description: "Instant communication with anyone from anywhere.",
            },
            {
              icon: Users,
              title: "Group Channels",
              description: "Create and manage channels for team collaboration.",
            },
            {
              icon: Headset,
              title: "Video Calls",
              description:
                "Connect with your friends with voice and video calls.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="bg-[#2A2A2A] border-none hover:shadow-lg hover:shadow-[#1E90FF]/20 transition-all duration-300 group"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <feature.icon className="h-12 w-12 mb-4 text-[#1E90FF] group-hover:text-[#9C27B0] transition-colors duration-300" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F0F] py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Privacy</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#1E90FF] transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#1E90FF] transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#1E90FF] transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          © 2024 Communication Website. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
}
