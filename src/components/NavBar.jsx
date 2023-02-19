import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import Blockie from "./Blockie";

const Links = ["Dashboard", "Projects", "Team"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

// var icon = blockies.create({
//   // All options are optional
//   seed: "randstring", // seed used to generate icon data, default: random
//   color: "#dfe", // to manually specify the icon color, default: random
//   bgcolor: "#aaa", // choose a different background color, default: random
//   size: 15, // width/height of the icon in blocks, default: 8
//   scale: 3, // width/height of each block in pixels, default: 4
//   spotcolor: "#000", // each pixel has a 13% chance of being of a third color,
//   // default: random. Set to -1 to disable it. These "spots" create structures
//   // that look like eyes, mouths and noses.
// });

export default function NavBar({
  loggedIn,
  setLoggedIn,
  user,
  setUser,
  getNftsForOwners,
  setHasQueried,
  setResults,
  setUserAddress,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const icon = blockies.create({
  //   // All options are optional
  //   seed: user, // seed used to generate icon data, default: random
  //   // color: "#dfe", // to manually specify the icon color, default: random
  //   // bgcolor: '#aaa', // choose a different background color, default: random
  //   // size: 15, // width/height of the icon in blocks, default: 8
  //   // scale: 3, // width/height of each block in pixels, default: 4
  //   // spotcolor: '#000' // each pixel has a 13% chance of being of a third color,
  //   // default: random. Set to -1 to disable it. These "spots" create structures
  //   // that look like eyes, mouths and noses.
  // });

  const handleLogIn = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const res = await provider.send("eth_requestAccounts", []);

    res && setLoggedIn.on();
    // console.log(res);
    setUser(res[0]);
    setUserAddress(res[0]);
    // console.log(user);
  };

  const handleLogOut = async () => {
    setLoggedIn.off();
    setHasQueried(false);
    setUser();
    setResults([]);
  };
  useEffect(() => {
    handleLogOut();
  }, []);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {/* <p>Boolean state: {loggedIn.toString()}</p> */}
            {!loggedIn ? (
              <Button
                onClick={handleLogIn}
                // onClick={setLoggedIn.on}
                variant={"solid"}
                colorScheme={"blue"}
                size={"sm"}
                mr={4}
              >
                Connect Wallet
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  // rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Blockie address={user} size={"sm"} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={getNftsForOwners}>My NFTs</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
