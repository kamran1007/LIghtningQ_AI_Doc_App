"use client";
import { useState } from "react";
import {
  FileText,
  X,
  Calendar,
  Tag,
  CheckCircle,
  Sparkles,
  Zap,
  Users,
  Building2,
  ClipboardList,
  Stethoscope,
  BarChart3,
} from "lucide-react";

export default function ReleaseNotes() {
  const [open, setOpen] = useState(false);

  const releaseData = {
    appName: "LightningQ",
    tagline: "AI-powered Healthcare Platform",
    version: "v1.0.0",
    releaseDate: "October 1, 2025",
    highlights: [
      "Multi-hospital management system",
      "AI-powered voice-to-text consultation",
      "Real-time patient queue management",
      "Automated reporting and analytics",
    ],
    notes: [
      {
        section: "Admin Module",
        icon: <Users className="w-6 h-6 text-blue-600" />,
        items: [
          "Manage multiple hospitals within a single organization (multi-hospital chain)",
          "Search hospitals via Google, auto-generate unique hospital code",
          "Manage users with multi-hospital assignments and access rights",
          "Doctors can define timeslots (daily, recurring, DND, cancellations, remarks)",
          "Set consultation charges, commissions, fast-track fees, and discounts",
        ],
      },
      {
        section: "Appointment Booking",
        icon: <ClipboardList className="w-6 h-6 text-green-600" />,
        items: [
          "Book appointments via popup modal with registered or QuickBook patients",
          "QuickBook allows booking without prior registration",
          "AI-based and calendar-based booking (coming soon)",
          "Notifications via WhatsApp, SMS, and email",
        ],
      },
      {
        section: "Patient Care(OP)",
        icon: <Building2 className="w-6 h-6 text-purple-600" />,
        items: [
          "Register patients with demographics, emergency details, allergies, and languages",
          "Capture patient photo, emergency contacts, past medical records",
          "Outpatient Queue Management with live status and FIFO rule support",
        ],
      },
      {
        section: "Consultation",
        icon: <Stethoscope className="w-6 h-6 text-red-600" />,
        items: [
          "Record vitals and maintain patient history timeline",
          "Add complaints, diagnosis, and prescribe medicines",
          "Voice-to-text for remarks (AI-powered)",
          "Generate and share case sheets in PDF via email",
        ],
      },
      {
        section: "Dashboard",
        icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
        items: [
          "View revenue, patient demographics, and consultations in real-time",
          "Filter by doctor, hospital, or patient type",
          "Automated weekly and monthly reports sent to admin email",
        ],
      },
    ],
  };

  return (
    <>
      {/* Navbar Icon */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
      >
        <FileText className="w-6 h-6 text-white group-hover:text-teal-600 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-04 overflow-y-auto">
          <div className="mt-20 bg-gradient-to-br from-white via-teal-50 to-white max-w-4xl w-full rounded-3xl shadow-2xl relative overflow-hidden border border-teal-100">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-200/30 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-100/40 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

            {/* Header */}
            <div className="relative p-8 border-b border-teal-100/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                      {releaseData.appName}
                    </h2>
                    <p className="text-lg text-teal-600 font-medium">
                      {releaseData.tagline}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-teal-200 rounded-xl transition-colors group"
                >
                  <X className="w-6 h-6 text-teal-500 group-hover:text-teal-600 cursor-pointer" />
                </button>
              </div>

              {/* Version Info */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-teal-600" />
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {releaseData.version}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600 font-medium">
                    Released {releaseData.releaseDate}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Key Highlights
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {releaseData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Release Notes */}
            <div className="relative p-8 max-h-[60vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 text-teal-600 mr-2" />
                What&apos;s New
              </h3>

              <div className="space-y-6">
                {releaseData.notes.map((section, index) => (
                  <div key={index} className="group">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-4">
                        {section.icon}
                        <h4 className="text-xl font-semibold text-gray-900">
                          {section.section}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start space-x-3 group/item"
                          >
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0 group-hover/item:bg-teal-600 transition-colors"></div>
                            <p className="text-gray-700 leading-relaxed">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="relative p-6 bg-gradient-to-r from-teal-50 to-white border-t border-teal-100">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {/* <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">LQ</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    LightningQ
                  </span> */}
                </div>
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} LightningQ. Transforming
                  healthcare with AI-powered solutions.
                </p>
                {/* <p className="text-xs text-gray-500 mt-1">
                  Built with passion for better healthcare outcomes.
                </p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
