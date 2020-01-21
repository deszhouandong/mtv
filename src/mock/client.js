// 客户
import Mock, {
  Random
} from "mockjs";

export default [{
  rurl: "/musicRankings",
  rtype: "post",
  template: config => {
    return {
      code: 0,
      data: {
        list: Mock.mock({
          "list|10": [{
            date: "@datetime",
            name: "@cname",
            province: "@province",
            city: "@city",
            zip: "@zip"
          }]
        })['list'],
      },
    };
  },
}, ];
