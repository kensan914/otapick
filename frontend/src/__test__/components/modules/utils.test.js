import {
  deepCvtKeyFromSnakeToCamel,
  URLJoin,
} from "../../../components/modules/utils";

test("URLJoin unit test", () => {
  expect(URLJoin("http://www.google.com", "a", "b", "c")).toBe(
    "http://www.google.com/a/b/c/"
  );
  expect(URLJoin("http://www.google.com/", "a", "b", "c")).toBe(
    "http://www.google.com/a/b/c/"
  );
  expect(URLJoin("http://www.google.com", "/a", "b/", "/c/", "d")).toBe(
    "http://www.google.com/a/b/c/d/"
  );
  expect(URLJoin("http://www.google.com", 1, "2", 3, "/4")).toBe(
    "http://www.google.com/1/2/3/4/"
  );
  expect(URLJoin("http://www.google.com", "a", undefined, "/b/cd", null)).toBe(
    "http://www.google.com/a/b/cd/"
  );
  expect(URLJoin("http://www.google.com", "?foo=123")).toBe(
    "http://www.google.com/?foo=123"
  );
  expect(URLJoin("http://www.google.com", "?foo=123", "?bar=foo")).toBe(
    "http://www.google.com/?foo=123&bar=foo"
  );
  expect(URLJoin("http://www.google.com", "?foo=123/", "?bar=foo")).toBe(
    "http://www.google.com/?foo=123&bar=foo"
  );
  expect(
    URLJoin("http://www.google.com", "?number=", 123, "?string=", "123")
  ).toBe("http://www.google.com/?number=123&string=123");
  expect(URLJoin("http://www.google.com", "?list=", [1, 2, 3])).toBe(
    "http://www.google.com/?list=1,2,3"
  );
  expect(URLJoin("http://www.google.com", "?list=", [1, "2", true])).toBe(
    "http://www.google.com/?list=1,2,true"
  );
  expect(URLJoin("http://www.google.com", "?list=", [1, "2", [3.1, 3.2]])).toBe(
    "http://www.google.com/?list=1,2,3.1,3.2"
  );
  expect(
    URLJoin(
      "http://www.google.com",
      "a",
      undefined,
      "/b/cd",
      null,
      "?foo=123",
      "?bar=foo",
      "?list=",
      [1, "a"]
    )
  ).toBe("http://www.google.com/a/b/cd/?foo=123&bar=foo&list=1,a");
});

test("deepCvtKeyFromSnakeToCamel unit test", () => {
  expect(deepCvtKeyFromSnakeToCamel({ aaa_bbb: "ab" })).toEqual({
    aaaBbb: "ab",
  });
  expect(deepCvtKeyFromSnakeToCamel({ aaa_bbb: "ab", ccc_ddd: "cd" })).toEqual({
    aaaBbb: "ab",
    cccDdd: "cd",
  });
  expect(
    deepCvtKeyFromSnakeToCamel({ aaa_bbb: "ab", ccc_ddd: { eee_fff: "ef" } })
  ).toEqual({
    aaaBbb: "ab",
    cccDdd: { eeeFff: "ef" },
  });
  expect(
    deepCvtKeyFromSnakeToCamel({
      aaa_bbb: ["a", "b"],
      ccc_ddd: [{ eee_fff: "ef" }, "d", { ggg_hhh: "gh" }],
    })
  ).toEqual({
    aaaBbb: ["a", "b"],
    cccDdd: [{ eeeFff: "ef" }, "d", { gggHhh: "gh" }],
  });
  expect(deepCvtKeyFromSnakeToCamel("a")).toEqual("a");
  expect(deepCvtKeyFromSnakeToCamel(1)).toEqual(1);
  expect(deepCvtKeyFromSnakeToCamel(true)).toEqual(true);
  expect(
    deepCvtKeyFromSnakeToCamel({
      aaa_bbb: [[["a", { iii_jjj: "ij" }]]],
    })
  ).toEqual({
    aaaBbb: [[["a", { iiiJjj: "ij" }]]],
  });
  expect(
    deepCvtKeyFromSnakeToCamel({
      aaa_bbb: [[["a", { iii_jjj: [true, 2, "z"] }]]],
      ccc_ddd: [
        { eee_fff: "ef" },
        "d",
        { ggg_hhh: "gh" },
        [[{ eee_fff: "ef" }, "d", { ggg_hhh: 333 }], { kkk_lll: "kl" }],
      ],
    })
  ).toEqual({
    aaaBbb: [[["a", { iiiJjj: [true, 2, "z"] }]]],
    cccDdd: [
      { eeeFff: "ef" },
      "d",
      { gggHhh: "gh" },
      [[{ eeeFff: "ef" }, "d", { gggHhh: 333 }], { kkkLll: "kl" }],
    ],
  });
});
