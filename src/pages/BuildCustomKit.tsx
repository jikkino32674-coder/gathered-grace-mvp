import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuildCustomKitForm from "@/components/BuildCustomKitForm";

const BuildCustomKit = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-20 bg-background">
          <div className="container max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl mb-4">Build Your Own Kit</h1>
              <p className="text-xl text-muted-foreground mb-2">Custom Quote</p>
              <p className="text-lg max-w-2xl mx-auto">
                Select the items you'd like included, share details about the recipient, and we'll create a personalized quote just for you.
              </p>
            </div>

            <BuildCustomKitForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BuildCustomKit;
