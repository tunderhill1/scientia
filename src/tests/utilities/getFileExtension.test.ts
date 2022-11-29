import { getFileExtension } from '../../lib/utilities.service'

test.each`
  path                                                                                                        | expected
  ${''}                                                                                                       | ${''}
  ${'name'}                                                                                                   | ${''}
  ${'name.txt'}                                                                                               | ${'.txt'}
  ${'.htpasswd'}                                                                                              | ${''}
  ${'name.with.many.dots.myext'}                                                                              | ${'.myext'}
  ${'2223/40009/1._Haskell/00fd3bc473af4c6baeb8369dca765d89Lecture05-06.pdf'}                                 | ${'.pdf'}
  ${'2223/40009/1._Haskell/5932ad003bd144b0b3309a51a17c6643Lecture07.hs'}                                     | ${'.hs'}
  ${'2223/40009/1._Haskell/8b09e3c7e50a41c8bc21fdecda3fdb7cLecture06.zip'}                                    | ${'.zip'}
  ${'2223/40009/0._General/0f88da8727a74d6e8379b0ca37d236d6DoC_-_Welcome_to_the_First_Year.pdf'}              | ${'.pdf'}
  ${'2223/40009/1._Haskell/6b0d05e812054bfb9cca8971e1e6840fFP_Lecture_1-4.pdf'}                               | ${'.pdf'}
  ${'2223/40009/0._General/01ff75bf2db84e09bd05955b8c3352c5DoCSoc_-_Basics_of_Git_and_GitLab.pdf'}            | ${'.pdf'}
  ${'2223/40009/0._General/e6de4c92eba7493fbba5a5306c8e8e46DoCSoc_-_Guide_To_Linux_And_The_Command_Line.pdf'} | ${'.pdf'}
  ${'2223/40009/5._C/528b8334e31b4be88fcf6289a15fcee6Placeholder.txt'}                                        | ${'.txt'}
  ${'2223/40009/3._Ethics/05c5fe48eb554e50aa00ac319a4204daPlaceholder.txt'}                                   | ${'.txt'}
  ${'2223/40009/4._Java/35a729a9fea94cfa98810e5dd9d3ddc8Placeholder.txt'}                                     | ${'.txt'}
  ${'2223/40009/0._General/864f9def3d4f4775b7f4c06f490e413cDoCSoc_-_calculator-demo.zip'}                     | ${'.zip'}
  ${'2223/40009/6._Architecture__J_M_C/2793fd1458de4a989f4a6e68748834ecPlaceholder.txt'}                      | ${'.txt'}
  ${'2223/40009/1._Haskell/fa7365918af5479aaa7859a650bfbd77Solutions_to_unassessed_exercises_5.pdf'}          | ${'.pdf'}
  ${'2223/40009/1._Haskell/e665afb7d450423895139dd82914c533Lecture07-09.pdf'}                                 | ${'.pdf'}
  ${'2223/40009/1._Haskell/c85e69d3824241d6bf065794290814e0Solutions_to_unassessed_exercises_6.pdf'}          | ${'.pdf'}
  ${'2223/40009/0._General/c9b5114da60e43cfb325ee6ab1981f1bImperial_Horizons_2022-23.pdf'}                    | ${'.pdf'}
  ${'2223/40009/1._Haskell/5123c4d9dd0445f1a7b36d30fc7d68c2Lectures10-11.pdf'}                                | ${'.pdf'}
  ${'2223/40009/1._Haskell/7cf4bad0b42f4e6894996ff1da714983Practice_test_skeleton.hs'}                        | ${'.hs'}
  ${'2223/40009/0._General/3fccab1bf3e44358b3b1f2bdfeebe8cckgk_-_Intro_to_Year_1__The_Lab.pdf'}               | ${'.pdf'}
  ${'2223/40009/1._Haskell/e0300cb07ca04a1da8d94cd7ce4cf424Practice_test_spec.pdf'}                           | ${'.pdf'}
  ${'2223/40009/1._Haskell/3da646ddc97d479aa9332a05314c9400Practice_test_Test_File_Radix_trees.hs'}           | ${'.hs'}
  ${'2223/40009/1._Haskell/0c95210256684fb2a3ff9ca759801511Lecture12-13.pdf'}                                 | ${'.pdf'}
  ${'2223/40009/1._Haskell/e975562386464bdb904c7df9c0981e23Solutions_to_unassessed_exercises_3.pdf'}          | ${'.pdf'}
  ${'2223/40009/1._Haskell/11e723b19fcc495c8f3355f699a316e9Solutions_to_unassessed_exercises_2.pdf'}          | ${'.pdf'}
  ${'2223/40009/1._Haskell/7ee1342a13bb44c6876887aabe4fdb6eSolutions_to_unassessed_exercises_1.pdf'}          | ${'.pdf'}
  ${'2223/40009/0._General/7070de27fb6d48caad9dd755430ac5d1DoCSoc_-_Text_Editors_and_Compilers.pdf'}          | ${'.pdf'}
  ${'2223/40009/0._General/7df72ffb50054b1cad1d54d9bb7ac539DoCSoc_-_Linux_and_The_Command_Line.pdf'}          | ${'.pdf'}
  ${'2223/40009/1._Haskell/15eadbda547342a58674895a3464567fUnassessed_Exercises.pdf'}                         | ${'.pdf'}
  ${'2223/40009/1._Haskell/6873726ebddd417eb7142614ec662b37Solutions_to_unassessed_exercises_4.pdf'}          | ${'.pdf'}
  ${'2223/40009/0._General/231d10676e78460d9ae5f67be64182d3Careers_-_Teamwork__MBTI.pdf'}                     | ${'.pdf'}
  ${'2223/40009/0._General/8f07ae1d91884928a07694493b4eaba0Careers_-_Personality_Pairings.pdf'}               | ${'.pdf'}
`('can extract file extension from file path', ({ path, expected }) => {
  const actual = getFileExtension(path)
  expect(actual).toBe(expected)
})
