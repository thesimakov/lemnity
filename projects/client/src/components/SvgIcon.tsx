import React from "react";

interface SvgIconProps {
  src: string;
  className?: string;
  size?: number | string;
  alt?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  src,
  className = "",
  size = "100%",
  alt = "icon",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");

        if (svgElement) {
          // Удаляем потенциально опасные элементы и атрибуты
          const dangerousElements = svgElement.querySelectorAll(
            "script, object, embed, iframe",
          );
          dangerousElements.forEach((el) => el.remove());

          const allElements = svgElement.querySelectorAll("*");

          allElements.forEach((el) => {
            // Удаляем event handlers
            const attributes = [...el.attributes];
            attributes.forEach((attr) => {
              if (
                attr.name.startsWith("on") ||
                attr.name === "href" ||
                attr.name === "xlink:href"
              ) {
                el.removeAttribute(attr.name);
              }
            });

            // Заменяем fill на currentColor
            if (el.hasAttribute("fill")) {
              el.setAttribute("fill", "currentColor");
            }

            // Устанавливаем размеры SVG
            svgElement.setAttribute("width", size.toString());
            svgElement.setAttribute("height", size.toString());
          });

          // Очищаем контейнер и добавляем SVG
          containerRef.current!.innerHTML = "";
          containerRef.current!.appendChild(svgElement);
        }
      });
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center ${className} select-none`}
      role="img"
      aria-label={alt}
    />
  );
};

export default SvgIcon;
