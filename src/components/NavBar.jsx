import { useEffect } from "react";
import { ethers } from "ethers";

import {
  Box,
  Flex,
  HStack,
  Link,
  Image,
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
import Blockie from "./Blockie";

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

  const handleLogIn = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const res = await provider.send("eth_requestAccounts", []);

    res && setLoggedIn.on();
    setUser(res[0]);
    setUserAddress(res[0]);
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
          <HStack spacing={8} alignItems={"center"}>
            <Image
              src="https://i.imgur.com/Bd90yaN.png"
              boxSize="50px"
              objectFit="cover"
            />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            ></HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {!loggedIn ? (
              <Button
                onClick={handleLogIn}
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
