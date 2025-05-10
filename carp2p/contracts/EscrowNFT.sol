// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract EscrowNFT {
    struct Escrow {
        address seller;
        address buyer;
        address nftAddress;
        uint256 tokenId;
        address paymentToken;
        uint256 price;
        bool nftDeposited;
        bool paymentDeposited;
        bool completed;
        bool cancelled;
    }

    uint256 public escrowCounter;
    mapping(uint256 => Escrow) public escrows;

    event EscrowCreated(uint256 escrowId, address indexed seller, address indexed nft, uint256 tokenId, uint256 price, address paymentToken);
    event NFTDeposited(uint256 escrowId);
    event PaymentDeposited(uint256 escrowId);
    event EscrowCompleted(uint256 escrowId);
    event EscrowCancelled(uint256 escrowId);

    modifier onlyNotCompleted(uint256 escrowId) {
        require(!escrows[escrowId].completed, "Escrow already completed");
        _;
    }

    modifier onlyNotCancelled(uint256 escrowId) {
        require(!escrows[escrowId].cancelled, "Escrow cancelled");
        _;
    }

    function createEscrow(
        address _buyer,
        address _nftAddress,
        uint256 _tokenId,
        address _paymentToken,
        uint256 _price
    ) external returns (uint256) {
        require(IERC721(_nftAddress).ownerOf(_tokenId) == msg.sender, "Sender is not NFT owner");
        require(_price > 0, "Price must be greater than 0");

        escrowCounter++;
        escrows[escrowCounter] = Escrow({
            seller: msg.sender,
            buyer: _buyer,
            nftAddress: _nftAddress,
            tokenId: _tokenId,
            paymentToken: _paymentToken,
            price: _price,
            nftDeposited: false,
            paymentDeposited: false,
            completed: false,
            cancelled: false
        });

        emit EscrowCreated(escrowCounter, msg.sender, _nftAddress, _tokenId, _price, _paymentToken);
        return escrowCounter;
    }

    function depositNFT(uint256 escrowId) external onlyNotCompleted(escrowId) onlyNotCancelled(escrowId) {
        Escrow storage e = escrows[escrowId];
        require(msg.sender == e.seller, "Only seller can deposit NFT");
        require(!e.nftDeposited, "NFT already deposited");

        IERC721(e.nftAddress).transferFrom(msg.sender, address(this), e.tokenId);
        e.nftDeposited = true;

        emit NFTDeposited(escrowId);
        _tryFinalize(escrowId);
    }

    function depositPayment(uint256 escrowId) external onlyNotCompleted(escrowId) onlyNotCancelled(escrowId) {
        Escrow storage e = escrows[escrowId];

        // Si el comprador fue especificado, lo validamos
        if (e.buyer != address(0)) {
            require(msg.sender == e.buyer, "Only the defined buyer can deposit payment");
        } else {
            // En ventas abiertas, el primero que paga se vuelve el comprador
            e.buyer = msg.sender;
        }

        require(!e.paymentDeposited, "Payment already deposited");
        IERC20(e.paymentToken).transferFrom(msg.sender, address(this), e.price);
        e.paymentDeposited = true;

        emit PaymentDeposited(escrowId);
        _tryFinalize(escrowId);
    }

    function cancelEscrow(uint256 escrowId) external onlyNotCompleted(escrowId) onlyNotCancelled(escrowId) {
        Escrow storage e = escrows[escrowId];
        require(msg.sender == e.seller || msg.sender == e.buyer, "Not authorized");

        if (e.nftDeposited) {
            IERC721(e.nftAddress).transferFrom(address(this), e.seller, e.tokenId);
        }

        if (e.paymentDeposited) {
            IERC20(e.paymentToken).transfer(e.buyer, e.price);
        }

        e.cancelled = true;
        emit EscrowCancelled(escrowId);
    }

    function _tryFinalize(uint256 escrowId) internal {
        Escrow storage e = escrows[escrowId];
        if (e.nftDeposited && e.paymentDeposited && !e.completed) {
            e.completed = true;
            IERC721(e.nftAddress).transferFrom(address(this), e.buyer, e.tokenId);
            IERC20(e.paymentToken).transfer(e.seller, e.price);

            emit EscrowCompleted(escrowId);
        }
    }
}
