const markdownService = require("motionlink-cli/lib/services/markdown_service");
const ObjectTransformers = markdownService.ObjectTransformers;

/** @type {import("motionlink-cli/lib/models/config_models").TemplateRule[]} */
const rules = [
  {
    template: "index.template.html",
    outDir: ".",
    uses: {
      database: "personalInfoDb",
      takeOnly: 1,
      fetchBlocks: false,
      map: (page, ctx) => {
        page.otherData.resumeLink = "";

        page.otherData.aboutMe = ObjectTransformers.transform_all(
          page.data.properties.AboutMe.rich_text
        );

        page.otherData.topSkills =
          page.data.properties.TopSkills.multi_select.map(
            (skill) => skill.name
          );

        page.otherData.latestProjects = ctx.others.latestProjectsDb.pages.map(
          (page) => page.otherData
        );

        page.otherData.education = ctx.others.educationDb.pages.map(
          (page) => page.otherData
        );

        page.otherData.experience = ctx.others.experienceDb.pages.map(
          (page) => page.otherData
        );

        page._title = "index";
        return page;
      },
    },
    alsoUses: [
      {
        database: "educationDb",
        fetchBlocks: false,
        map: (page, _) => {
          page.otherData.institution = ObjectTransformers.transform_all(
            page.data.properties.Institution.title
          );

          page.otherData.qualification = ObjectTransformers.transform_all(
            page.data.properties.Qualification.rich_text
          );

          page.otherData.description = ObjectTransformers.transform_all(
            page.data.properties.Description.rich_text
          );

          page.otherData.period = ObjectTransformers.transform_all(
            page.data.properties.Period.rich_text
          );

          return page;
        },
      },
      {
        database: "experienceDb",
        fetchBlocks: false,
        sort: [
          {
            timestamp: "created_time",
            direction: "descending",
          },
        ],
        map: (page, _) => {
          page.otherData.companyName = ObjectTransformers.transform_all(
            page.data.properties.CompanyName.title
          );

          page.otherData.role = page.data.properties.Role.select.name;

          page.otherData.description = ObjectTransformers.transform_all(
            page.data.properties.Description.rich_text
          );

          page.otherData.period = ObjectTransformers.transform_all(
            page.data.properties.Period.rich_text
          );

          return page;
        },
      },
      {
        database: "latestProjectsDb",
        takeOnly: 3,
        fetchBlocks: false,
        sort: [
          {
            timestamp: "last_edited_time",
            direction: "descending",
          },
        ],
        map: (page, ctx) => {
          page.otherData.name = ObjectTransformers.transform_all(
            page.data.properties.Name.title
          );

          page.otherData.logoUrl = ctx.fetchMedia(
            page.data.properties.Logo.files[0]
          ).src;

          page.otherData.description = ObjectTransformers.transform_all(
            page.data.properties.Description.rich_text
          );

          page.otherData.url = page.data.properties.Url.url;
          return page;
        },
      },
    ],
  },
];

module.exports = rules;
