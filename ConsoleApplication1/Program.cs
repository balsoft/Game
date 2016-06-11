using System;
using System.Net.Sockets;
using System.IO;
using DynamicExpresso;
namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Game server v 0.1");
            Console.WriteLine("Type help for help");
            
            UdpClient UDP = new UdpClient(5000);
        }
    }
}
