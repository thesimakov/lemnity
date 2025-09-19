import { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useProjectsStore } from "@/stores/projectsStore";
import AddProjectModal from "@/layouts/AddProjectsBlock/AddProjectModal";
import ProjectRow from "./ProjectRow";
import ProjectListHeader from "./ProjectListHeader";
import SvgIcon from "@/components/SvgIcon";
import addIcon from "@/assets/icons/add.svg";

const ProjectList = () => {
  const projects = useProjectsStore((s) => s.projects);
  const [filter, setFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    // пока фильтрация не реализована, возвращаем все проекты
    return projects;
  }, [projects, filter]);

  if (!projects.length) return null;

  return (
    <section className="flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Select
            label="Ваши проекты"
            labelPlacement="outside-left"
            variant="bordered"
            radius="sm"
            selectedKeys={[filter]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              setFilter(key ?? "all");
            }}
            className="w-82"
            classNames={{
                label: "text-2xl",
            }}
          >
            <SelectItem key="all">Все проекты</SelectItem>
          </Select>
        </div>
        <Button className="bg-[#FFB400] text-black rounded-sm" startContent={<SvgIcon size={"20px"} src={addIcon} />} color="primary" onPress={() => setIsModalOpen(true)}>
          Создать проект
        </Button>
      </div>

      <ProjectListHeader />
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
        {filteredProjects.map((project) => (
          <ProjectRow
            key={project.id}
            id={project.id}
            name={project.name}
            enabled={project.enabled}
            visitors={project.metrics.visitors}
            impressions={project.metrics.impressions}
            conversions={project.metrics.conversions}
            activityPercent={project.metrics.activity.value}
          />
        ))}
      </div>

      {isModalOpen && (
        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddProject={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default ProjectList;


