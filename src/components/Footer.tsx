export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto w-full bg-pink-400 text-lime-300 items-center">
      <p className="text-center">
        Made by real fingers (what a concept) &copy; {currentYear} Cityr Trackerly. No rights
        reserved, feel free to fuck this shit up lol.
      </p>
    </footer>
  );
};
