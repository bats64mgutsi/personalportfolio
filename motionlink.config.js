/** @type {import("motionlink-cli/lib/models/config_models").TemplateRule[]} */
const rules = [
  {
    template: "index.template.html",
    outDir: ".",
    uses: {
      database: "personalInfoDb",
      takeOnly: 1,
      map: (page, ctx) => {
        page.otherData.resumeLink =
          page.data.properties.Resume.files[0].file.url;

        page.otherData.aboutMe =
          page.data.properties.AboutMe.rich_text[0].plain_text;

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
        map: (page, _) => {
          page.otherData.institution =
            page.data.properties.Institution.title[0].plain_text;

          page.otherData.qualification -
            page.data.properties.Qualification.rich_text[0].plain_text;

          page.otherData.description =
            page.data.properties.Description.rich_text[0].plain_text;

          page.otherData.period =
            page.data.properties.Period.rich_text[0].plain_text;

          return page;
        },
      },
      {
        database: "experienceDb",
        sort: [
          {
            timestamp: "created_time",
            direction: "descending",
          },
        ],
        map: (page, _) => {
          page.otherData.companyName =
            page.data.properties.CompanyName.title[0].plain_text;

          page.otherData.role = page.data.properties.Role.select.name;

          page.otherData.description =
            page.data.properties.Description.rich_text[0].plain_text;

          page.otherData.period =
            page.data.properties.Period.rich_text[0].plain_text;
          return page;
        },
      },
      {
        database: "latestProjectsDb",
        takeOnly: 3,
        sort: [
          {
            timestamp: "last_edited_time",
            direction: "descending",
          },
        ],
        map: (page, _) => {
          page.otherData.name = page.data.properties.Name.title[0].plain_text;

          page.otherData.logoUrl = page.data.properties.Logo.files[0].file.url;

          page.otherData.description =
            page.data.properties.Description.rich_text[0].plain_text;

          page.otherData.url = page.data.properties.Url.url;
          return page;
        },
      },
    ],
  },
];

export default rules;
